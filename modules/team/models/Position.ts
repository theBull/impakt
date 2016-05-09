/// <reference path='./models.ts' />

module Team.Models {
    export class Position
    extends Common.Models.Modifiable {

            public positionListValue: Team.Models.PositionList;
            public title: string;
            public label: string;
            public eligible: boolean;
            public index: number;
            public unitType: Team.Enums.UnitTypes;

            constructor(unitType: Team.Enums.UnitTypes, options?: any) {
                super();
                super.setContext(this);
                
                if (!options)
                    options = {};

                this.unitType = unitType;
                this.positionListValue = options.positionListValue || PositionList.Other;
                this.title = options.title || 'Untitled';
                this.label = options.label || '-';
                this.eligible = options.eligible || false;
                this.index = options.index >= 0 ? options.index : -1;
            }
            public toJson(): any {
                return {
                    positionListValue: this.positionListValue,
                    title: this.title,
                    label: this.label,
                    eligible: this.eligible,
                    index: this.index,
                    unitType: this.unitType,
                    guid: this.guid
                };
            }
            public fromJson(json: any): any {
                this.positionListValue = json.positionListValue;
                this.label = json.label;
                this.eligible = json.eligible;
                this.title = json.title;
                this.unitType = json.unitType;
                this.index = json.index;
                this.guid = json.guid;
            }
        }

    export enum PositionList {
        BlankOffense,
        BlankDefense,
        BlankSpecialTeams,
        BlankOther,
        Quarterback,
        RunningBack,
        FullBack,
        TightEnd,
        Center,
        Guard,
        Tackle,
        WideReceiver,
        SlotReceiver,
        NoseGuard,
        DefensiveTackle,
        DefensiveGuard,
        DefensiveEnd,
        Linebacker,
        Safety,
        FreeSafety,
        StrongSafety,
        DefensiveBack,
        Cornerback,
        Kicker,
        Holder,
        Punter,
        LongSnapper,
        KickoffSpecialist,
        PuntReturner,
        KickReturner,
        Upback,
        Gunner,
        Jammer,
        Other
    }

    export class PositionDefault {
        
        public static defaults: any;

        constructor() {
            Team.Models.PositionDefault.defaults = {
                blankOffense: {
                    positionListValue: Team.Models.PositionList.BlankOffense,
                    title: 'Blank',
                    label: '',
                    unitType: Team.Enums.UnitTypes.Offense,
                    eligible: false
                },
                blankDefense: {
                    positionListValue: Team.Models.PositionList.BlankDefense,
                    title: 'Blank',
                    label: '',
                    unitType: Team.Enums.UnitTypes.Defense,
                    eligible: false
                },
                blankSpecialTeams: {
                    positionListValue: Team.Models.PositionList.BlankSpecialTeams,
                    title: 'Blank',
                    label: '',
                    unitType: Team.Enums.UnitTypes.SpecialTeams,
                    eligible: false
                },
                blankOther: {
                    positionListValue: Team.Models.PositionList.BlankOther,
                    title: 'Blank',
                    label: '',
                    unitType: Team.Enums.UnitTypes.Other,
                    eligible: false
                },
                quarterback: {
                    positionListValue: Team.Models.PositionList.Quarterback,
                    title: 'Quarterback',
                    label: 'QB',
                    unitType: Team.Enums.UnitTypes.Offense,
                    eligible: false
                },
                runningBack: {
                    positionListValue: Team.Models.PositionList.RunningBack,
                    title: 'Running Back',
                    label: 'RB',
                    unitType: Team.Enums.UnitTypes.Offense,
                    eligible: true
                },
                fullBack: {
                    positionListValue: Team.Models.PositionList.FullBack,
                    title: 'Full Back',
                    label: 'FB',
                    unitType: Team.Enums.UnitTypes.Offense,
                    eligible: true
                },
                tightEnd: {
                    positionListValue: Team.Models.PositionList.TightEnd,
                    title: 'Tight End',
                    label: 'TE',
                    unitType: Team.Enums.UnitTypes.Offense,
                    eligible: true
                },
                center: {
                    positionListValue: Team.Models.PositionList.Center,
                    title: 'Center',
                    label: 'C',
                    unitType: Team.Enums.UnitTypes.Offense,
                    eligible: false
                },
                guard: {
                    positionListValue: Team.Models.PositionList.Guard,
                    title: 'Guard',
                    label: 'G',
                    unitType: Team.Enums.UnitTypes.Offense,
                    eligible: false
                },
                tackle: {
                    positionListValue: Team.Models.PositionList.Tackle,
                    title: 'Tackle',
                    label: 'T',
                    unitType: Team.Enums.UnitTypes.Offense,
                    eligible: false
                },
                wideReceiver: {
                    positionListValue: Team.Models.PositionList.WideReceiver,
                    title: 'Wide Receiver',
                    label: 'WR',
                    unitType: Team.Enums.UnitTypes.Offense,
                    eligible: true
                },
                slotReceiver: {
                    positionListValue: Team.Models.PositionList.SlotReceiver,
                    title: 'Slot Receiver',
                    label: 'SL',
                    unitType: Team.Enums.UnitTypes.Offense,
                    eligible: true
                },
                noseGuard: {
                    positionListValue: Team.Models.PositionList.NoseGuard,
                    title: 'Nose Guard',
                    label: 'N',
                    unitType: Team.Enums.UnitTypes.Defense,
                    eligible: false
                },
                defensiveGuard: {
                    positionListValue: Team.Models.PositionList.DefensiveGuard,
                    title: 'Guard',
                    label: 'G',
                    unitType: Team.Enums.UnitTypes.Defense,
                    eligible: false
                },
                defensiveTackle: {
                    positionListValue: Team.Models.PositionList.DefensiveTackle,
                    title: 'Tackle',
                    label: 'T',
                    unitType: Team.Enums.UnitTypes.Defense,
                    eligible: false
                },
                defensiveEnd: {
                    positionListValue: Team.Models.PositionList.DefensiveEnd,
                    title: 'Defensive End',
                    label: 'DE',
                    unitType: Team.Enums.UnitTypes.Defense,
                    eligible: false
                },
                linebacker: {
                    positionListValue: Team.Models.PositionList.Linebacker,
                    title: 'Linebacker',
                    label: 'LB',
                    unitType: Team.Enums.UnitTypes.Defense,
                    eligible: false
                },
                safety: {
                    positionListValue: Team.Models.PositionList.Safety,
                    title: 'Safety',
                    label: 'S',
                    unitType: Team.Enums.UnitTypes.Defense,
                    eligible: false
                },
                freeSafety: {
                    positionListValue: Team.Models.PositionList.FreeSafety,
                    title: 'Free Safety',
                    label: 'FS',
                    unitType: Team.Enums.UnitTypes.Defense,
                    eligible: false
                },
                strongSafety: {
                    positionListValue: Team.Models.PositionList.StrongSafety,
                    title: 'Strong Safety',
                    label: 'SS',
                    unitType: Team.Enums.UnitTypes.Defense,
                    eligible: false
                },
                defensiveBack: {
                    positionListValue: Team.Models.PositionList.DefensiveBack,
                    title: 'Defensive Back',
                    label: 'DB',
                    unitType: Team.Enums.UnitTypes.Defense,
                    eligible: false
                },
                cornerback: {
                    positionListValue: Team.Models.PositionList.Cornerback,
                    title: 'Cornerback',
                    label: 'CB',
                    unitType: Team.Enums.UnitTypes.Defense,
                    eligible: false
                },
                kicker: {
                    positionListValue: Team.Models.PositionList.Kicker,
                    title: 'Kicker',
                    label: 'K',
                    unitType: Team.Enums.UnitTypes.SpecialTeams,
                    eligible: false
                },
                holder: {
                    positionListValue: Team.Models.PositionList.Holder,
                    title: 'Holder',
                    label: 'H',
                    unitType: Team.Enums.UnitTypes.SpecialTeams,
                    eligible: false
                },
                punter: {
                    positionListValue: Team.Models.PositionList.Punter,
                    title: 'Punter',
                    label: 'P',
                    unitType: Team.Enums.UnitTypes.SpecialTeams,
                    eligible: false
                },
                longSnapper: {
                    positionListValue: Team.Models.PositionList.LongSnapper,
                    title: 'Long Snapper',
                    label: 'LS',
                    unitType: Team.Enums.UnitTypes.SpecialTeams,
                    eligible: false
                },
                kickoffSpecialist: {
                    positionListValue: Team.Models.PositionList.KickoffSpecialist,
                    title: 'Kickoff Specialist',
                    label: 'KS',
                    unitType: Team.Enums.UnitTypes.SpecialTeams,
                    eligible: false
                },
                puntReturner: {
                    positionListValue: Team.Models.PositionList.PuntReturner,
                    title: 'Punt Returner',
                    label: 'PR',
                    unitType: Team.Enums.UnitTypes.SpecialTeams,
                    eligible: true
                },
                kickReturner: {
                    positionListValue: Team.Models.PositionList.KickReturner,
                    title: 'Kick Returner',
                    label: 'KR',
                    unitType: Team.Enums.UnitTypes.SpecialTeams,
                    eligible: true
                },
                upback: {
                    positionListValue: Team.Models.PositionList.Upback,
                    title: 'Upback',
                    label: 'U',
                    unitType: Team.Enums.UnitTypes.SpecialTeams,
                    eligible: true
                },
                gunner: {
                    positionListValue: Team.Models.PositionList.Gunner,
                    title: 'Gunner',
                    label: 'G',
                    unitType: Team.Enums.UnitTypes.SpecialTeams,
                    eligible: true
                },
                jammer: {
                    positionListValue: Team.Models.PositionList.Jammer,
                    title: 'Jammer',
                    label: 'J',
                    unitType: Team.Enums.UnitTypes.SpecialTeams,
                    eligible: true
                },
                other: {
                    positionListValue: Team.Models.PositionList.Other,
                    title: 'Other',
                    label: '-',
                    unitType: Team.Enums.UnitTypes.Other,
                    eligible: false
                }
            };
        }
        
        public getPosition (positionListValue) {
            let results = null;
            for (let positionKey in Team.Models.PositionDefault.defaults) {
                if (Team.Models.PositionDefault.defaults[positionKey].positionListValue == positionListValue) {
                    let positionSeedData = Team.Models.PositionDefault.defaults[positionKey];
                    results = new Team.Models.Position(positionSeedData.unitType, positionSeedData);
                }
            }
            return results;
        }
        public switchPosition (fromPosition, toPositionEnum) {
            let newPosition = this.getPosition(toPositionEnum);
            newPosition.index = fromPosition.index;
            return newPosition;
        }
        public static getBlank(type: Team.Enums.UnitTypes) {
            let collection = new Team.Models.PositionCollection(type);
            let positionSeedData = null;
            switch (type) {
                case Team.Enums.UnitTypes.Offense:
                    positionSeedData = Team.Models.PositionDefault.defaults.blankOffense;
                    break;
                case Team.Enums.UnitTypes.Defense:
                    positionSeedData = Team.Models.PositionDefault.defaults.blankDefense;
                    break;
                case Team.Enums.UnitTypes.SpecialTeams:
                    positionSeedData = Team.Models.PositionDefault.defaults.blankSpecialTeams;
                    break;
                case Team.Enums.UnitTypes.Other:
                    positionSeedData = Team.Models.PositionDefault.defaults.blankOther;
                    break;
            }
            if (!positionSeedData)
                return null;
            for (let i = 0; i < 11; i++) {
                let blank = new Team.Models.Position(positionSeedData.unitType, positionSeedData);
                // add an index for the position :]
                blank.index = i;
                collection.add(blank);
            }
            return collection;
        }

        public getByUnitType (type: Team.Enums.UnitTypes) {
            let results = new Team.Models.PositionCollection(type);
            switch (type) {
                case Team.Enums.UnitTypes.Offense:
                    results.fromJson([
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.blankOffense),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.quarterback),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.runningBack),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.fullBack),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.tightEnd),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.center),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.guard),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.tackle),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.wideReceiver),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.slotReceiver)
                    ]);
                    break;
                case Team.Enums.UnitTypes.Defense:
                    results.fromJson([
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.blankDefense),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.noseGuard),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.defensiveTackle),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.defensiveGuard),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.defensiveEnd),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.linebacker),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.safety),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.freeSafety),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.strongSafety),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.defensiveBack),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.cornerback)
                    ]);
                    break;
                case Team.Enums.UnitTypes.SpecialTeams:
                    results.fromJson([
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.blankSpecialTeams),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.kicker),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.holder),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.punter),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.longSnapper),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.kickoffSpecialist),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.puntReturner),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.kickReturner),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.upback),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.gunner),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.jamme)
                    ]);
                    break;
                case Team.Enums.UnitTypes.Other:
                    results.fromJson([
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.blankOther),
                        new Team.Models.Position(type, Team.Models.PositionDefault.defaults.other)
                    ]);
                    break;
                default:
                    results = null;
                    break;
            }
            return results;
        };
    }
}