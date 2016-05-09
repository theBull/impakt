/// <reference path='./models.ts' />

module Common.Models {

	/**
	 * Associates an element with one or more other elements
	 * by guid.
	 */
	export class Association
	extends Common.Models.Modifiable {

		public fromKey: number;
		public fromType: Common.Enums.ImpaktDataTypes;
		public fromGuid: string;
		public toKey: number;
		public toType: Common.Enums.ImpaktDataTypes;
		public toGuid: string;
		public contextId: number;
		public internalKey: string;
		public version: number;
		public data: any;
		public associationType: Common.Enums.AssociationTypes;
		protected static KEY_PART_LENGTH = 3;
		
		constructor(
			fromKey: number, 
			fromType: Common.Enums.ImpaktDataTypes,
			fromGuid: string,
			toKey: number,
			toType: Common.Enums.ImpaktDataTypes,
			toGuid: string,
			contextId: number
		) {
			super();
			super.setContext(this);

			this.fromKey = fromKey;
			this.fromType = fromType;
			this.fromGuid = fromGuid;
			this.toKey = toKey;
			this.toType = toType;
			this.toGuid = toGuid;
			this.data = {
				guid: this.guid,
				fromGuid: this.fromGuid,
				toGuid: this.toGuid
			};
			this.version = 1;
			this.contextId = contextId;
			this.internalKey = Common.Models.Association.buildKey(this);
			this.associationType = Common.Enums.AssociationTypes.Peer;
		}

		public static buildKey(association: Common.Models.Association): string {
			return [association.fromType, '|', association.fromKey, '|', association.fromGuid].join('');
		}

		public static parse(internalKey: string): Common.Models.AssociationParts {
			if (Common.Utilities.isNullOrUndefined(internalKey))
				throw new Error('Association parse(): internalKey is null or undefined');

			let parts = internalKey.split('|');
			if (parts.length <= 0)
				throw new Error('Association parse(): internalKey is invalid; missing "|" separator');
			if (parts.length != Common.Models.Association.KEY_PART_LENGTH)
				throw new Error('Association parse(): internalKey is invalid; invalid number of parts');

			// assume by this point we have an array of 3 parts
			// part 1: EntityType
			// part 2: EntityKey (fromKey)
			// part 3: Entity guid (client-generated for quick lookup)

			// - get the entity type
			// - ensure it exists in the ImpaktDataTypes enum
			if (Common.Utilities.isNullOrUndefined(parts[0])) {
				throw new Error('Association parse(): internalKey is invalid; entityType is null or undefined');
			}
			let entityType = parseInt(parts[0]);

			if (Common.Utilities.isNullOrUndefined(Common.Enums.ImpaktDataTypes[entityType])) {
				throw new Error('Association parse(): internalKey is invalid; entityType is not valid ImpaktDataType');
			}

			// - get the entity key
			// - ensure it is a valid key
			if (Common.Utilities.isNullOrUndefined(parts[1]) || parseInt(parts[1]) <= 0) {
				throw new Error('Association parse(): internalKey is invalid; entityKey is invalid');
			}
			let entityKey = parseInt(parts[1]);

			// - get the entity guid
			if (Common.Utilities.isNullOrUndefined(parts[2])) {
				throw new Error('Association parse(): internalKey is invalid; entity guid is null or undefined');
			}
			let entityGuid = parts[2];

			return new Common.Models.AssociationParts(entityType, entityKey, entityGuid);
		}

		public toJson(): any {
			return {
				fromKey: this.fromKey,
				fromType: this.fromType,
				toKey: this.toKey,
				toType: this.toType,
				contextID: this.contextId + '',
				data: this.data,
				version: this.version,
				associationType: this.associationType
			}
		}

		public fromJson(json: any) {
			if (!json)
				return;

			if(json.data) {
				this.guid = json.data.guid;
				this.fromGuid = json.data.fromGuid;
				this.toGuid = json.data.toGuid;
			} else {
				throw new Error('Association fromJson(): data is null or undefined');
			}

			this.fromKey = json.fromKey;
			this.fromType = json.fromType;
			this.toKey = json.toKey;
			this.toType = json.toType;
			this.contextId = json.contextID;
			this.data = json.data;
			this.associationType = json.associationType;
			this.version = json.version;
		}
	}

	export class AssociationParts {
		public entityKey: number;
		public entityType: Common.Enums.ImpaktDataTypes;
		public entityGuid: string;

		constructor(entityType: Common.Enums.ImpaktDataTypes, entityKey: number, guid: string) {
			this.entityType = entityType;
			this.entityKey = entityKey;
			this.entityGuid = guid;
		}
	}
}