/// <reference path='./models.ts' />

module Common.Models {
	
	export class AssociableEntity
	extends Common.Models.Actionable
	implements Common.Interfaces.IAssociable {

		public key: number;
		public impaktDataType: Common.Enums.ImpaktDataTypes;
		public associationKey: string;
		public associable: string[];
		public name: string;

		constructor(
			impaktDataType: Common.Enums.ImpaktDataTypes
		) {
			super(impaktDataType);

			this.key = 0;
			this.impaktDataType = impaktDataType;
			this.associationKey = null;
			this.name = null;

			/**
			 * This array maintains a list of associable data types,
			 * by key name, which can be found in AssociationResults.ts.
			 * 
			 * The idea is that Associable Entities only have certain
			 * associations that they can map to, and we want to allow
			 * the Entity to define what those applicable associations are.
			 *
			 * For example, the Associable Entity `League` may only be
			 * two-way-associated to `Conference`, `Division` and `Team`,
			 * and each in turn also define their associability back to `League`.
			 *
			 * The `associable` list is not an all-authoritive structure;
			 * setting this does not prevent certain other associations from being
			 * created programmatically between two Associable Entites that
			 * do not have one another defined within their `associable` list.
			 * It is up to the developer to decide how to best use this list.
			 *
			 * One use case is to render a set of UI controls that allow the user
			 * to manage an Associable Entity's associations, but only renders
			 * the controls for each element in the `assosciable` array. 
			 * 
			 * @type {Array}
			 */
			this.associable = [
				'playbooks',
				'scenarios',
				'plays',
				'formations',
				'personnel',
				'assignmentGroups',
				'leagues',
				'conferences',
				'divisions',
				'locations',
				'teams',
				'seasons',
				'games'
			];
		}

		public generateAssociationKey() {
			this.associationKey = [
				this.impaktDataType,
				'|',
				this.key,
				'|',
				this.guid
			].join('');
		}

		public toJson(): any {
			return $.extend({
				key: this.key,
				impaktDataType: this.impaktDataType,
				associationKey: this.associationKey,
				name: this.name
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				throw new Error('AssociableEntity fromJson(): json is null or undefined');

			this.key = json.key;
			this.impaktDataType = json.impaktDataType;
			this.name = json.name;
			
			super.fromJson(json);

			this.generateAssociationKey();			
		}

	}
}