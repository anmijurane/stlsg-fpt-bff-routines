import { IsEmail, IsIn, IsNotEmpty, IsObject, IsOptional, IsString, ValidateIf, ValidateNested, registerDecorator, ValidationOptions } from 'class-validator';
import { Type } from 'class-transformer';
import { DemographicAgeRange, DemographicGender, DemographicMembership } from 'src/app-types/demographic-form';

export const IsContactValid = (validationOptions?: ValidationOptions) => (object: Object, propertyName: string) => {
  registerDecorator({
    name: 'isContactValid',
    target: object.constructor,
    propertyName: propertyName,
    options: validationOptions,
    validator: {
      validate(contact: any) {
        if (!contact || typeof contact !== 'object') return false;
        const email = typeof contact.email === 'string' ? contact.email.trim() : '';
        const phone = typeof contact.phone === 'string' ? contact.phone.trim() : '';
        return email || phone;
      },
      defaultMessage() {
        return 'At least one contact method (email or phone) must be provided and not empty';
      },
    },
  });
};

export class ContactDto {
  @IsOptional()
  @ValidateIf((o, v) => v !== '' && v !== null && v !== undefined)
  @IsEmail()
  email?: string;

  @IsOptional()
  @ValidateIf((o, v) => v !== '' && v !== null && v !== undefined)
  @IsString()
  phone?: string;
}

export class DemographicFormReqDto {
  @IsNotEmpty()
  @IsIn(['male', 'female', 'other'])
  gender: DemographicGender;

  @IsNotEmpty()
  @IsIn(['<18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'])
  age_range: DemographicAgeRange;

  @IsNotEmpty()
  @IsIn(['classic-card', 'pf-black-card', 'invite'])
  membership: DemographicMembership;

  @ValidateIf(o => o.membership === 'invite')
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactDto)
  @IsContactValid()
  contact?: ContactDto;
}
