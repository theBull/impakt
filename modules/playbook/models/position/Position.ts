/// <reference path='../models.ts' />

module Playbook.Models {
    export class Position
    extends Common.Models.Modifiable {

            public positionListValue: Playbook.Models.PositionList;
            public title: string;
            public label: string;
            public eligible: boolean;
            public index: number;
            public unitType: Playbook.Editor.UnitTypes;

            constructor(options?: any) {
                super(this);
                if (!options)
                    options = {};
                this.positionListValue = options.positionListValue || PositionList.Other;
                this.title = options.title || 'Untitled';
                this.label = options.label || '-';
                this.eligible = options.eligible || false;
                this.index = options.index >= 0 ? options.index : -1;
                this.unitType = options.unitType || Playbook.Editor.UnitTypes.Other;
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
            Playbook.Models.PositionDefault.defaults = {
                blankOffense: {
                    positionListValue: Playbook.Models.PositionList.BlankOffense,
                    title: 'Blank',
                    label: '',
                    unitType: Playbook.Editor.UnitTypes.Offense,
                    eligible: false
                },
                blankDefense: {
                    positionListValue: Playbook.Models.PositionList.BlankDefense,
                    title: 'Blank',
                    label: '',
                    unitType: Playbook.Editor.UnitTypes.Defense,
                    eligible: false
                },
                blankSpecialTeams: {
                    positionListValue: Playbook.Models.PositionList.BlankSpecialTeams,
                    title: 'Blank',
                    label: '',
                    unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                    eligible: false
                },
                blankOther: {
                    positionListValue: Playbook.Models.PositionList.BlankOther,
                    title: 'Blank',
                    label: '',
                    unitType: Playbook.Editor.UnitTypes.Other,
                    eligible: false
                },
                quarterback: {
                    positionListValue: Playbook.Models.PositionList.Quarterback,
                    title: 'Quarterback',
                    label: 'QB',
                    unitType: Playbook.Editor.UnitTypes.Offense,
                    eligible: false
                },
                runningBack: {
                    positionListValue: Playbook.Models.PositionList.RunningBack,
                    title: 'Running Back',
                    label: 'RB',
                    unitType: Playbook.Editor.UnitTypes.Offense,
                    eligible: true
                },
                fullBack: {
                    positionListValue: Playbook.Models.PositionList.FullBack,
                    title: 'Full Back',
                    label: 'FB',
                    unitType: Playbook.Editor.UnitTypes.Offense,
                    eligible: true
                },
                tightEnd: {
                    positionListValue: Playbook.Models.PositionList.TightEnd,
                    title: 'Tight End',
                    label: 'TE',
                    unitType: Playbook.Editor.UnitTypes.Offense,
                    eligible: true
                },
                center: {
                    positionListValue: Playbook.Models.PositionList.Center,
                    title: 'Center',
                    label: 'C',
                    unitType: Playbook.Editor.UnitTypes.Offense,
                    eligible: false
                },
                guard: {
                    positionListValue: Playbook.Models.PositionList.Guard,
                    title: 'Guard',
                    label: 'G',
                    unitType: Playbook.Editor.UnitTypes.Offense,
                    eligible: false
                },
                tackle: {
                    positionListValue: Playbook.Models.PositionList.Tackle,
                    title: 'Tackle',
                    label: 'T',
                    unitType: Playbook.Editor.UnitTypes.Offense,
                    eligible: false
                },
                wideReceiver: {
                    positionListValue: Playbook.Models.PositionList.WideReceiver,
                    title: 'Wide Receiver',
                    label: 'WR',
                    unitType: Playbook.Editor.UnitTypes.Offense,
                    eligible: true
                },
                slotReceiver: {
                    positionListValue: Playbook.Models.PositionList.SlotReceiver,
                    title: 'Slot Receiver',
                    label: 'SL',
                    unitType: Playbook.Editor.UnitTypes.Offense,
                    eligible: true
                },
                noseGuard: {
                    positionListValue: Playbook.Models.PositionList.NoseGuard,
                    title: 'Nose Guard',
                    label: 'N',
                    unitType: Playbook.Editor.UnitTypes.Defense,
                    eligible: false
                },
                defensiveGuard: {
                    positionListValue: Playbook.Models.PositionList.DefensiveGuard,
                    title: 'Guard',
                    label: 'G',
                    unitType: Playbook.Editor.UnitTypes.Defense,
                    eligible: false
                },
                defensiveTackle: {
                    positionListValue: Playbook.Models.PositionList.DefensiveTackle,
                    title: 'Tackle',
                    label: 'T',
                    unitType: Playbook.Editor.UnitTypes.Defense,
                    eligible: false
                },
                defensiveEnd: {
                    positionListValue: Playbook.Models.PositionList.DefensiveEnd,
                    title: 'Defensive End',
                    label: 'DE',
                    unitType: Playbook.Editor.UnitTypes.Defense,
                    eligible: false
                },
                linebacker: {
                    positionListValue: Playbook.Models.PositionList.Linebacker,
                    title: 'Linebacker',
                    label: 'LB',
                    unitType: Playbook.Editor.UnitTypes.Defense,
                    eligible: false
                },
                safety: {
                    positionListValue: Playbook.Models.PositionList.Safety,
                    title: 'Safety',
                    label: 'S',
                    unitType: Playbook.Editor.UnitTypes.Defense,
                    eligible: false
                },
                freeSafety: {
                    positionListValue: Playbook.Models.PositionList.FreeSafety,
                    title: 'Free Safety',
                    label: 'FS',
                    unitType: Playbook.Editor.UnitTypes.Defense,
                    eligible: false
                },
                strongSafety: {
                    positionListValue: Playbook.Models.PositionList.StrongSafety,
                    title: 'Strong Safety',
                    label: 'SS',
                    unitType: Playbook.Editor.UnitTypes.Defense,
                    eligible: false
                },
                defensiveBack: {
                    positionListValue: Playbook.Models.PositionList.DefensiveBack,
                    title: 'Defensive Back',
                    label: 'DB',
                    unitType: Playbook.Editor.UnitTypes.Defense,
                    eligible: false
                },
                cornerback: {
                    positionListValue: Playbook.Models.PositionList.Cornerback,
                    title: 'Cornerback',
                    label: 'CB',
                    unitType: Playbook.Editor.UnitTypes.Defense,
                    eligible: false
                },
                kicker: {
                    positionListValue: Playbook.Models.PositionList.Kicker,
                    title: 'Kicker',
                    label: 'K',
                    unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                    eligible: false
                },
                holder: {
                    positionListValue: Playbook.Models.PositionList.Holder,
                    title: 'Holder',
                    label: 'H',
                    unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                    eligible: false
                },
                punter: {
                    positionListValue: Playbook.Models.PositionList.Punter,
                    title: 'Punter',
                    label: 'P',
                    unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                    eligible: false
                },
                longSnapper: {
                    positionListValue: Playbook.Models.PositionList.LongSnapper,
                    title: 'Long Snapper',
                    label: 'LS',
                    unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                    eligible: false
                },
                kickoffSpecialist: {
                    positionListValue: Playbook.Models.PositionList.KickoffSpecialist,
                    title: 'Kickoff Specialist',
                    label: 'KS',
                    unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                    eligible: false
                },
                puntReturner: {
                    positionListValue: Playbook.Models.PositionList.PuntReturner,
                    title: 'Punt Returner',
                    label: 'PR',
                    unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                    eligible: true
                },
                kickReturner: {
                    positionListValue: Playbook.Models.PositionList.KickReturner,
                    title: 'Kick Returner',
                    label: 'KR',
                    unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                    eligible: true
                },
                upback: {
                    positionListValue: Playbook.Models.PositionList.Upback,
                    title: 'Upback',
                    label: 'U',
                    unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                    eligible: true
                },
                gunner: {
                    positionListValue: Playbook.Models.PositionList.Gunner,
                    title: 'Gunner',
                    label: 'G',
                    unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                    eligible: true
                },
                jammer: {
                    positionListValue: Playbook.Models.PositionList.Jammer,
                    title: 'Jammer',
                    label: 'J',
                    unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                    eligible: true
                },
                other: {
                    positionListValue: Playbook.Models.PositionList.Other,
                    title: 'Other',
                    label: '-',
                    unitType: Playbook.Editor.UnitTypes.Other,
                    eligible: false
                }
            };
        }
        
        public getPosition (positionListValue) {
            let results = null;
            for (let positionKey in Playbook.Models.PositionDefault.defaults) {
                if (Playbook.Models.PositionDefault.defaults[positionKey].positionListValue == positionListValue) {
                    let positionSeedData = Playbook.Models.PositionDefault.defaults[positionKey];
                    results = new Playbook.Models.Position(positionSeedData);
                }
            }
            return results;
        }
        public switchPosition (fromPosition, toPositionEnum) {
            let newPosition = this.getPosition(toPositionEnum);
            newPosition.index = fromPosition.index;
            return newPosition;
        }
        public static getBlank(type: Playbook.Editor.UnitTypes) {
            let collection = new Playbook.Models.PositionCollection();
            let positionSeedData = null;
            switch (type) {
                case Playbook.Editor.UnitTypes.Offense:
                    positionSeedData = Playbook.Models.PositionDefault.defaults.blankOffense;
                    break;
                case Playbook.Editor.UnitTypes.Defense:
                    positionSeedData = Playbook.Models.PositionDefault.defaults.blankDefense;
                    break;
                case Playbook.Editor.UnitTypes.SpecialTeams:
                    positionSeedData = Playbook.Models.PositionDefault.defaults.blankSpecialTeams;
                    break;
                case Playbook.Editor.UnitTypes.Other:
                    positionSeedData = Playbook.Models.PositionDefault.defaults.blankOther;
                    break;
            }
            if (!positionSeedData)
                return null;
            for (let i = 0; i < 11; i++) {
                let blank = new Playbook.Models.Position(positionSeedData);
                // add an index for the position :]
                blank.index = i;
                collection.add(blank);
            }
            return collection;
        }

        public getByUnitType (type: Playbook.Editor.UnitTypes) {
            let results = null;
            switch (type) {
                case Playbook.Editor.UnitTypes.Offense:
                    let offense = new Playbook.Models.PositionCollection();
                    offense.fromJson([
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.blankOffense),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.quarterback),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.runningBack),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.fullBack),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.tightEnd),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.center),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.guard),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.tackle),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.wideReceiver),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.slotReceiver)
                    ]);
                    results = offense;
                    break;
                case Playbook.Editor.UnitTypes.Defense:
                    let defense = new Playbook.Models.PositionCollection();
                    defense.fromJson([
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.blankDefense),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.noseGuard),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.defensiveTackle),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.defensiveGuard),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.defensiveEnd),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.linebacker),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.safety),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.freeSafety),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.strongSafety),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.defensiveBack),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.cornerback)
                    ]);
                    results = defense;
                    break;
                case Playbook.Editor.UnitTypes.SpecialTeams:
                    let specialTeams = new Playbook.Models.PositionCollection();
                    specialTeams.fromJson([
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.blankSpecialTeams),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.kicker),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.holder),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.punter),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.longSnapper),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.kickoffSpecialist),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.puntReturner),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.kickReturner),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.upback),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.gunner),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.jamme)
                    ]);
                    results = specialTeams;
                    break;
                case Playbook.Editor.UnitTypes.Other:
                    let other = new Playbook.Models.PositionCollection();
                    other.fromJson([
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.blankOther),
                        new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.other)
                    ]);
                    results = other;
                    break;
                default:
                    results = null;
                    break;
            }
            return results;
        };
    }
}