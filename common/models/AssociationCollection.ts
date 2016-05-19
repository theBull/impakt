/// <reference path='./models.ts' />

module Common.Models {
	export class AssociationCollection
	extends Common.Models.Modifiable {

		private _data: any;
		private _size: number;
		public contextId: number;

		constructor(contextId: number) {
			super();
			super.setContext(this);
			this._data = {};
			this._size = 0;
			this.contextId = contextId;
		}

		/** 
		 * Returns the size of the association collection
		 * @return {number} size
		 */
		public size(): number {
			return this._size;
		}

		/**
		 * Returns whether the association collection has elements
		 * @return {boolean} true or false
		 */
		public isEmpty(): boolean {
			return this.size() == 0;
		}

		/**
		 * Returns whether the array has elements
		 * @return {boolean} true or false
		 */
		public hasElements(): boolean {
			return this.size() > 0;
		}

		/**
		 * Creates an association, and an inverse association, between
		 * the two given entities.
		 * 
		 * @param {Common.Interfaces.IAssociable} fromEntity [description]
		 * @param {Common.Interfaces.IAssociable} toEntity   [description]
		 */
		public add(
			fromEntity: Common.Interfaces.IAssociable,
			toEntity: Common.Interfaces.IAssociable
		): void {
			let fromAssociation = new Common.Models.Association(
				fromEntity.key,
				fromEntity.impaktDataType,
				fromEntity.guid,
				toEntity.key,
				toEntity.impaktDataType,
				toEntity.guid,
				this.contextId
			);
			
			this.addAssociation(fromAssociation);
		}

		/**
		 * Creates an association between the given entity and all of the
		 * given array of entities.
		 * 
		 * @param {Common.Interfaces.IAssociable}   fromEntity [description]
		 * @param {Common.Interfaces.IAssociable[]} entities   [description]
		 */
		public addAll(
			fromEntity: Common.Interfaces.IAssociable, 
			entities: Common.Interfaces.IAssociable[]
		): void {
			if (Common.Utilities.isNullOrUndefined(entities))
				throw new Error('AssociationCollection addAll(): entities[] is null or undefined');

			for (let i = 0; i < entities.length; i++) {
				let toEntity = entities[i];
				if (Common.Utilities.isNullOrUndefined(toEntity))
					continue;

				let fromAssociation = new Common.Models.Association(
					fromEntity.key,
					fromEntity.impaktDataType,
					fromEntity.guid,
					toEntity.key,
					toEntity.impaktDataType,
					toEntity.guid,
					this.contextId
				);

				this.addAssociation(fromAssociation);
			}
		}

		/**
		 * Creates an 'inverse' association with the given association, and
		 * adds both to the association collection 
		 * 
		 * @param {Common.Models.Association} association the 'from' association
		 */
		public addAssociation(association: Common.Models.Association): void {
			let toAssociation = new Common.Models.Association(
				association.toKey,
				association.toType,
				association.toGuid,
				association.fromKey,
				association.fromType,
				association.fromGuid,
				this.contextId
			);

			if (!this._data[association.internalKey]) {
				this._data[association.internalKey] = [];
				this._size++;
			}

			if(this._data[association.internalKey].indexOf(toAssociation.internalKey) < 0)
				this._data[association.internalKey].push(toAssociation.internalKey);

			if (!this._data[toAssociation.internalKey]) {
				this._data[toAssociation.internalKey] = [];
				this._size++;
			}

			if (this._data[toAssociation.internalKey].indexOf(association.internalKey) < 0)
				this._data[toAssociation.internalKey].push(association.internalKey);
		}

		public addInternalKey(internalKey: string, associations: string[]): void {
			if(Common.Utilities.isNullOrUndefined(internalKey) ||
				Common.Utilities.isNullOrUndefined(associations)) {
				throw new Error('AssociationCollection addInternalKey(): \
					internalKey or associations[] is null or undefined');
			}

			if (this.exists(internalKey)) {
				// merge the internalKey's associations
				// with the existing internalKey's associations
				this._data[internalKey] = Common.Utilities.uniqueArray(
					this._data[internalKey].concat(associations)
				);
			} else {
				this._data[internalKey] = associations;
				this._size++;
			}
		}

		/**
		 * Merges another association collection into this association collection;
		 * ignores any duplicate entries.
		 * 
		 * @param {Common.Models.AssociationCollection} associationCollection association collection to merge
		 */
		public merge(associationCollection: Common.Models.AssociationCollection): void {
			if (Common.Utilities.isNullOrUndefined(associationCollection))
				throw new Error('AssignmentCollection merge(): associationCollection to \
					merge is null or undefined');

			if (associationCollection.isEmpty())
				return;

			// iterate over all entries in associationCollection to merge
			var targetCollection = this;
			associationCollection.forEach(function(
				self: Common.Models.AssociationCollection,
				internalKey: string
			) {
				// gather the to merge collection's array of associations
				let associations = self.getByInternalKey(internalKey);

				// add the internalKey to the target collection with blank array
				targetCollection.addInternalKey(internalKey, associations);

			});
		}

		public getByInternalKey(internalKey: string): string[] {
			if (Common.Utilities.isNullOrUndefined(internalKey))
				throw new Error('AssociationCollection get(): internalKey is null or undefined');

			return this._data[internalKey];
		}

		public hasAssociations(internalKey: string): boolean {
			if (Common.Utilities.isNullOrUndefined(internalKey))
				throw new Error('AssociationCollection hasAssociations(): internalKey is null or undefined');

			if(!this.exists(internalKey)) {
				return false;
			}

			let associations = this._data[internalKey];
			if (Common.Utilities.isNullOrUndefined(associations)) {
				// shouldn't be null or undefined, so let's set it
				// for proper house keeping...any issues with this,
				// or any reason an internal key might point to null/undefined?
				this._data[internalKey] = [];
			}
			return associations.length > 0;
		}

		public empty() {
			this._data = {};
			this._size = 0;
		}

		public delete(internalKey: string): Common.Models.AssociationCollection {
			if (Common.Utilities.isNullOrUndefined(internalKey))
				throw new Error('AssociationCollection remove(): internalKey is null or undefined');

			let associationsRemoved = new Common.Models.AssociationCollection(this.contextId);

			if(this.exists(internalKey)) {
				let internalKeyParts = Common.Models.Association.parse(internalKey);
				let associations = this._data[internalKey];
				for (let i = 0; i < associations.length; i++) {
					if (Common.Utilities.isNullOrUndefined(associations[i]))
						continue;

					let associatedKeyParts = Common.Models.Association.parse(associations[i]);
					let association = new Common.Models.Association(
						internalKeyParts.entityKey,
						internalKeyParts.entityType,
						internalKeyParts.entityGuid,
						associatedKeyParts.entityKey,
						associatedKeyParts.entityType,
						associatedKeyParts.entityGuid,
						this.contextId
					);

					associationsRemoved.addAssociation(association);
				}
				
				delete this._data[internalKey];
				this._size--;

				this.forEach(function(self: Common.Models.AssociationCollection, associationKey: string) {
					let associations = self._data[associationKey].associations;

					if (!associations || associations.length == 0) {
						// Clean up; we shouldn't have empty arrays
						// in the associations collection; we know that
						// if there is only 1 element in the associations array,
						// then we should effectively 
						delete self._data[associationKey];
						self._size--;
						return;
					}

					if(associations.length > 0) {
						let index = associations.indexOf(internalKey);
						if(index >= 0) {
							associations.splice(index, 1);
							if(associations.length == 0) {
								delete self._data[associationKey];
								self._size--;
							}
						}
					}
				});
			}

			return associationsRemoved;
		}

		/**
		 * Removes the association ONLY between the two entities, and only
		 * completely removes them if their respective association arrays
		 * are empty as a result.
		 * 
		 * @param {Common.Interfaces.IAssociable} fromEntity [description]
		 * @param {Common.Interfaces.IAssociable} toEntity   [description]
		 */
		public disassociate(
			fromEntity: Common.Interfaces.IAssociable, 
			toEntity: Common.Interfaces.IAssociable
		) {
			if (Common.Utilities.isNullOrUndefined(fromEntity) ||
				Common.Utilities.isNullOrUndefined(toEntity))
				throw new Error('AssociationCollection disassociate(): from or to entity is null or undefined');

			let fromAssociation = new Common.Models.Association(
				fromEntity.key,
				fromEntity.impaktDataType,
				fromEntity.guid,
				toEntity.key,
				toEntity.impaktDataType,
				toEntity.guid,
				this.contextId
			);

			let toAssociation = new Common.Models.Association(
				toEntity.key,
				toEntity.impaktDataType,
				toEntity.guid,
				fromEntity.key,
				fromEntity.impaktDataType,
				fromEntity.guid,
				this.contextId
			);

			let fromAssociations = this._data[fromAssociation.internalKey];
			if (Common.Utilities.isNotNullOrUndefined(fromAssociations)) {
				
				if(fromAssociations.length > 1) {
					let index = fromAssociations.indexOf(toAssociation.internalKey);	
					if (index >= 0) {
						fromAssociations.splice(index, 1);
					}
				} else {
					delete this._data[fromAssociation.internalKey];
					this._size--;
				}
			} else {
				throw new Error('AssociationCollection disassociate(): No from association found');
			}

			let toAssociations = this._data[toAssociation.internalKey];
			if (Common.Utilities.isNotNullOrUndefined(toAssociations)) {

				if (toAssociations.length > 1) {
					let index = toAssociations.indexOf(fromAssociation.internalKey);
					if (index >= 0) {
						toAssociations.splice(index, 1);
					}
				} else {
					delete this._data[toAssociation.internalKey];
					this._size--;
				}
			} else {
				throw new Error('AssociationCollection disassociate(): No to association found');
			}

		}

		/**
		 * Returns whether the given guid exists 
		 * @param  {string}  guid the guid to check
		 * @return {boolean}      true if it exists, otherwise false
		 */
		public exists(internalKey: string): boolean {
			return Common.Utilities.isNotNullOrUndefined(this._data[internalKey]);
		}

		/**
		 * Returns whether there is an existing association between the given
		 * 'from' internalKey, 'to' the given internal key
		 * @param  {string}  fromInternalKey [description]
		 * @param  {string}  toInternalKey   [description]
		 * @return {boolean}                 [description]
		 */
		public associationExists(fromInternalKey: string, toInternalKey: string): boolean {
			if(this.exists(fromInternalKey)) {
				let associations = this.getByInternalKey(fromInternalKey);
				return associations.indexOf(toInternalKey) >= 0;
			} else {
				return false;
			}
		}

		/**
		 * Replaces guid1, if found, with guid2
		 * @param  {string} guid1 guid to be replaced
		 * @param  {string} guid2 guid to replace with
		 */
		public replace(guid1: string, guid2: string): void {
			// TODO @theBull
		}

		/**
		 * Iterates over each element in the array
		 * @param {Function} iterator the iterator function to call per element
		 */
		public forEach(iterator: Function): void {
			// TODO @theBull
			for (let internalKey in this._data) {				
				iterator(this, internalKey);
			}
		}

		public toArray(toJson?: boolean): any[] {
			toJson = toJson === true;

			let array = [];
			for(let fromInternalKey in this._data) {
				let fromParts = Common.Models.Association.parse(fromInternalKey);
				let associations = this._data[fromInternalKey];
				for (let i = 0; i < associations.length; i++) {
					let toInternalKey = associations[i];
					let toParts = Common.Models.Association.parse(toInternalKey);
					let association = new Common.Models.Association(
						fromParts.entityKey,
						fromParts.entityType,
						fromParts.entityGuid,
						toParts.entityKey,
						toParts.entityType,
						toParts.entityGuid,
						this.contextId
					);
					if(toJson) {
						array.push(association.toJson());
					} else {
						array.push(association);
					}
				}
			}
			return array;
		}

		public toJson(): any {
			return this.toArray(true);
		}

		public fromJson(json: any) {
			if (!json)
				return;

			// iterate over array of associations
			for (let i = 0; i < json.length; i++) {
				let rawAssociation = json[i];
				if(Common.Utilities.isNullOrUndefined(rawAssociation)) {
					throw new Error('AssociationCollection fromJson(): an association result\
						is null or undefined');
				}
				if(Common.Utilities.isNullOrUndefined(rawAssociation.data)) {
					throw new Error('AssociationCollection fromJson(): the data property of\
						an association result is null or undefined');
				}
				let association = new Common.Models.Association(
					rawAssociation.fromKey,
					rawAssociation.fromType,
					rawAssociation.data.fromGuid,
					rawAssociation.toKey,
					rawAssociation.toType,
					rawAssociation.data.toGuid,
					rawAssociation.contextID
				);
				
				this.addAssociation(association);
			}
		}

		public getInternalKeys(): string[] {
			let internalKeyArray = [];
			for(let internalKey in this._data) {
				internalKeyArray.push(internalKey);
			}
			return internalKeyArray;
		}
	}
}	