export enum FilterType {
  Date = 'date',
  SelectOne = 'selectOne',
  SelectMultiple = 'selectMultiple',
  Search = 'search',
  Radio = 'radio',
  NotFilled = 'notFilled'
}

export enum FilterBeneficiaryNotFilled {
  Gender = 'gender',
  AgeGroup = 'birthDate',
  BeneficiaryFamilySituation = 'familySituation',
  City = 'city',
  Department = 'department',
  Region = 'region',
  BeneficiaryAccommodationZone = 'accommodationZone',
  BeneficiaryAccommodationMode = 'accommodationMode',
  BeneficiaryMobility = 'mobility',
  BeneficiarySocioProfessionalCategory = 'socioProfessionalCategory'
}

export enum FilterFileInstructionNotFilled {
  PrescribingOrganization = 'prescribingOrganization',
  InstructorOrganization = 'instructorOrganization',
  HousingIsFirst = 'isFirst',
  HousingReason = 'reason'
}

export enum FilterFollowupNotFilled {
  ActionsEntreprises = 'actionsEntreprises',
  PrescribingOrganization = 'prescribingOrganization'
}
