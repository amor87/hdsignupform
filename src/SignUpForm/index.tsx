import { useState, useRef, SyntheticEvent } from 'react';

/* Child Components */
import FieldInput from '../components/FieldInput';
import Checkbox from '../components/Checkbox';
import Select, {Option, OptionProps, ForwardingSelectProps } from '../components/Select';
import Grid from '../components/Grid';
import Header from './Header';

/* Utils */
import apiCall from '../utils/Api';

/* Styles */
import './index.scss';

interface SignUpRequest {
  firstName: string,
  lastName: string,
  email: string,
  euResident: string,
  org: string | undefined,
  fieldName: string[],
}

interface SignUpResponse {
  status: string;
  message: string;
}

function isEmpty(value: string): boolean {
  return !value.trim();
}

function arrayInsertIf(condition: boolean, data: string): string[] {
  return condition ? [data] : [];
}

function getFieldsWithErrors(
  firstName: string,
  lastName: string,
  email: string,
  selectedOption: OptionProps | undefined,
  checkedBoxes: string[],
): string[] {
  return [
    ...arrayInsertIf(isEmpty(firstName), 'firstName'),
    ...arrayInsertIf(isEmpty(lastName), 'lastName'),
    ...arrayInsertIf(isEmpty(email), 'email'),
    ...arrayInsertIf(!selectedOption?.id, 'euResident'),
    ...arrayInsertIf(checkedBoxes.length === 0, 'checkboxes'),
  ];
}

function removeFromArray(stringArray: string[], value: string): string [] {
  return stringArray.filter((item: string) => item !== value);
}

export default function SignUpForm(): JSX.Element {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [selectedOption, setSelectedOption] = useState<OptionProps | undefined>();
  const [checkedBoxes, setCheckedBoxes] = useState<string[]>([]);
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [apiResponse, setApiResponse] = useState<SignUpResponse | undefined>();
  const selectRef = useRef<ForwardingSelectProps>(null);

  const handleInputTextChange = (evt: SyntheticEvent<HTMLInputElement>) => {
    const { id, value } = evt.currentTarget;

    switch (id) {
      case 'firstName': {
        setErrorFields(removeFromArray(errorFields, 'firstName'));
        setFirstName(value);
        break;
      }

      case 'lastName': {
        setErrorFields(removeFromArray(errorFields, 'lastName'));
        setLastName(value);
        break;
      }

      case 'email': {
        setErrorFields(removeFromArray(errorFields, 'email'));
        setEmail(value);
        break;
      }

      case 'organization': {
        setOrganization(value);
        break;
      }
    }
  }

  const handleCheckboxChange = (evt: SyntheticEvent<HTMLInputElement>) => {
    const { id, checked } = evt.currentTarget;

    const newCheckedBoxes = checked
      ? [...checkedBoxes, id]
      : checkedBoxes.filter((storedId: string) => storedId !== id);

    setErrorFields(removeFromArray(errorFields, 'checkboxes'));
    setCheckedBoxes(newCheckedBoxes);
  }

  const handleEUResidentChange = (newValue: OptionProps):void => {
    setErrorFields(removeFromArray(errorFields, 'euResident'));
    setSelectedOption(newValue);
  };

  const handleResetClick = (): void => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setOrganization('');
    setSelectedOption(undefined);
    selectRef?.current?.resetToDefault();
  };

  const handleSubscriptionApiCall = async (): Promise<void> => {
    if (!!selectedOption) {
      try {
        const requestObject = {
          firstName,
          lastName,
          email,
          euResident: selectedOption.id,
          org: organization,
          fieldName: checkedBoxes,
        };

        const response = await apiCall<SignUpRequest, SignUpResponse>('some_path', requestObject);
        setApiResponse(response);
      } catch(error) {
        setApiResponse(error);
      }
    }
  }

  const handleSubmitClick = async (): Promise<void> => {
    const fieldsWithErrors = getFieldsWithErrors(
      firstName,
      lastName,
      email,
      selectedOption,
      checkedBoxes,
    );

    if (fieldsWithErrors.length > 0) {
      setErrorFields(fieldsWithErrors);
      return;
    }

    await handleSubscriptionApiCall();
  };

  if (!!apiResponse) {
    const hint = apiResponse.status === 'error'
      ? `Hint: you gotta use testemail@domain.org as the email`
      : '';

    return (
      <div className="SignUp-container" style={{display: 'flex', flexDirection: 'column'}}>
        <span>{`Status: ${apiResponse.status}`}</span>
        <span>{`Message: ${apiResponse.message}`}</span>
        <span>{hint}</span>
      </div>
    );
  }

  return (
    <div className="SignUp-container">
      <Header />
      <Grid.Row>
        <Grid.Col from="1" to="7">
          <FieldInput htmlFor="firstName" label="First Name*" errorMessage="First name is required" hasError={errorFields.includes('firstName')}>
            <input type="text" id="firstName" name="firstName" value={firstName} onChange={handleInputTextChange} />
          </FieldInput>
        </Grid.Col>
        <Grid.Col from="7" to="13">
          <FieldInput htmlFor="lastName" label="Last Name*" errorMessage="Last name is required" hasError={errorFields.includes('lastName')}>
            <input type="text" id="lastName" name="lastName" value={lastName} onChange={handleInputTextChange} />
          </FieldInput>
        </Grid.Col>
        <Grid.Col from="1" to="7">
          <FieldInput htmlFor="email" label="Email Address*" errorMessage="Email is required" hasError={errorFields.includes('email')}>
            <input type="text" id="email" name="email" value={email} onChange={handleInputTextChange} />
          </FieldInput>
        </Grid.Col>
        <Grid.Col from="7" to="13">
          <FieldInput htmlFor="organization" label="Organization">
            <input type="text" id="organization" name="organization" value={organization} onChange={handleInputTextChange} />
          </FieldInput>
        </Grid.Col>
        <Grid.Col from="1" to="4" style={{position: 'relative', zIndex: 10}}>
          <FieldInput htmlFor="euResident" label="EU Resident*" style={{position: 'absolute', width: '100%',}} errorMessage="EU Resident is required" hasError={errorFields.includes('euResident')}>
            <Select ref={selectRef} htmlFor="euResident" onSelectedOptionChange={handleEUResidentChange}>
              <Option id="Yes" label="Yes" />
              <Option id="No" label="No" />
            </Select>
          </FieldInput>
        </Grid.Col>
        <Grid.Col from="1" to="7" style={{marginTop: '80px'}}>
          {errorFields.includes('checkboxes') && (
            <span className="has-error">At least one checkbox must be selected</span>
          )}
        </Grid.Col>
        <Grid.Col from="1" to="13">
          <fieldset>
            <legend style={{display: 'none'}}>At least one checkbox must be selected</legend>
            <Grid.Row>
            <Grid.Col from="1" to="7">
                <Checkbox id="advances" label="Advances" value="advances" onChange={handleCheckboxChange} checked={checkedBoxes.includes('advances')} />
            </Grid.Col>
            <Grid.Col from="7" to="13">
                <Checkbox id="alerts" label="Alerts" value="alerts" onChange={handleCheckboxChange} checked={checkedBoxes.includes('alerts')} />
            </Grid.Col>
            <Grid.Col from="1" to="7">
                <Checkbox id="otherCommunications" label="Other Communications" value="otherCommunications" onChange={handleCheckboxChange} checked={checkedBoxes.includes('otherCommunications')} />
            </Grid.Col>
            </Grid.Row>
          </fieldset>
        </Grid.Col>
        <Grid.Col from="1" to="6" style={{justifyContent: 'space-between', display: 'flex', marginBottom: '10px'}}>
          <button className="primary" aria-label="Submit" onClick={handleSubmitClick}>Submit</button>
          <button className="secondary" aria-label="Reset" onClick={handleResetClick}>Reset</button>
        </Grid.Col>
      </Grid.Row>
    </div>
  );
}
