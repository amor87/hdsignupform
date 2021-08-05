import { render, fireEvent, act, waitFor } from '@testing-library/react';
import SignUpForm from '.';
import {delay} from '../utils/testHelper';
import * as ApiCall from '../utils/Api';

function getErrorSpanParentNode(spanElem: HTMLSpanElement): HTMLLabelElement {
  return spanElem.parentNode as HTMLLabelElement;
}

describe('App', () => {
  it('renders the component', () => {
    const renderResult = render(<SignUpForm />);
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;

    expect(mainContainer).toHaveClass('SignUp-container');
    expect(mainContainer.querySelectorAll('input[type=text]')).toHaveLength(5);
    expect(mainContainer.querySelectorAll('input[type=checkbox]')).toHaveLength(3);
    expect(mainContainer.querySelectorAll('button')).toHaveLength(2);
    renderResult.unmount();
  });

  it('should clear the whole form if the reset button is clicked', async () => {
    const renderResult = render(<SignUpForm />);
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;

    const [firstName, lastName, email, organization] = mainContainer.querySelectorAll<HTMLInputElement>('input[type=text]');
    firstName && fireEvent.change(firstName, {target: {value: 'FIRST_NAME'}});
    expect(firstName.getAttribute('value')).toBe('FIRST_NAME');

    lastName && fireEvent.change(lastName, {target: {value: 'LAST_NAME'}});
    expect(lastName.getAttribute('value')).toBe('LAST_NAME');

    email && fireEvent.change(email, {target: {value: 'SOME_EMAIL'}});
    expect(email.getAttribute('value')).toBe('SOME_EMAIL');

    organization && fireEvent.change(organization, {target: {value: 'SOME_ORG'}});
    expect(organization.getAttribute('value')).toBe('SOME_ORG');

    const selectContainer = mainContainer.querySelector<HTMLDivElement>('div.Select-container');
    expect(selectContainer).not.toBeNull();

    const combobox = selectContainer?.childNodes[0] as HTMLDivElement ?? <div></div>;
    const input = combobox.childNodes[0] as HTMLInputElement;
    expect(input.getAttribute('value')).toBe('- Select one -');

    selectContainer && fireEvent(selectContainer, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const listbox = selectContainer?.childNodes[1] as HTMLUListElement;
    fireEvent(listbox.childNodes[1], new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));
    await delay(100);
    expect(input.getAttribute('value')).toBe('Yes');

    const checkboxes = mainContainer.querySelectorAll<HTMLInputElement>('input[type=checkbox]');
    checkboxes.forEach(async (checkbox: HTMLInputElement) => {
      fireEvent(checkbox, new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }));

      await delay(1000);

      expect(checkbox.getAttribute('checked')).toBe('true');
    });

    const resetButton = mainContainer.querySelectorAll('button')[1];
    fireEvent(resetButton, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(firstName.getAttribute('value')).toBe('');
    expect(lastName.getAttribute('value')).toBe('');
    expect(email.getAttribute('value')).toBe('');
    expect(organization.getAttribute('value')).toBe('');
    expect(input.getAttribute('value')).toBe('- Select one -');
    checkboxes.forEach(async (checkbox: HTMLInputElement) => {
      expect(checkbox.getAttribute('checked')).toBe(null);
    });

    expect(mainContainer.querySelectorAll('button')).toHaveLength(2);
    renderResult.unmount();
  });

  it('should show error for all mandatory fields', () => {
    const renderResult = render(<SignUpForm />);
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;

    const resetButton = mainContainer.querySelectorAll('button')[0];
    fireEvent(resetButton, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const allSpanError = mainContainer.querySelectorAll<HTMLSpanElement>('span.has-error');
    expect(allSpanError).toHaveLength(5);
    expect(getErrorSpanParentNode(allSpanError[0]).getAttribute('for')).toBe('firstName');
    expect(getErrorSpanParentNode(allSpanError[1]).getAttribute('for')).toBe('lastName');
    expect(getErrorSpanParentNode(allSpanError[2]).getAttribute('for')).toBe('email');
    expect(getErrorSpanParentNode(allSpanError[3]).getAttribute('for')).toBe('euResident');
    renderResult.unmount();
  });

  it('should show error for all mandatory fields', () => {
    const renderResult = render(<SignUpForm />);
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;

    const sendButton = mainContainer.querySelectorAll('button')[0];
    fireEvent(sendButton, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const allSpanError = mainContainer.querySelectorAll<HTMLSpanElement>('span.has-error');
    expect(allSpanError).toHaveLength(5);
    expect(getErrorSpanParentNode(allSpanError[0]).textContent).toContain('First name');
    expect(getErrorSpanParentNode(allSpanError[1]).textContent).toContain('Last name');
    expect(getErrorSpanParentNode(allSpanError[2]).textContent).toContain('Email');
    expect(getErrorSpanParentNode(allSpanError[3]).textContent).toContain('EU Resident');
    expect(getErrorSpanParentNode(allSpanError[4]).textContent).toContain('checkbox');
    renderResult.unmount();
  });

  it('should clear first name error message after entering information', () => {
    const renderResult = render(<SignUpForm />);
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;

    const sendButton = mainContainer.querySelectorAll('button')[0];
    fireEvent(sendButton, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(mainContainer.querySelectorAll<HTMLSpanElement>('span.has-error')).toHaveLength(5);

    const firstName = mainContainer.querySelector<HTMLInputElement>('#firstName');
    firstName && fireEvent.change(firstName, {target: {value: 'a'}});
    const allSpanError = mainContainer.querySelectorAll<HTMLSpanElement>('span.has-error');
    expect(allSpanError).toHaveLength(4);

    const foundSpan = Array.from(allSpanError).find((spanItem: HTMLSpanElement) => (
      spanItem?.textContent?.includes('First name')
    ));

    expect(foundSpan).toBeUndefined();
    renderResult.unmount();
  });

  it('should clear last name name error message after entering information', () => {
    const renderResult = render(<SignUpForm />);
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;

    const sendButton = mainContainer.querySelectorAll('button')[0];
    fireEvent(sendButton, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(mainContainer.querySelectorAll<HTMLSpanElement>('span.has-error')).toHaveLength(5);

    const lastName = mainContainer.querySelector<HTMLInputElement>('#lastName');
    lastName && fireEvent.change(lastName, {target: {value: 'a'}});
    const allSpanError = mainContainer.querySelectorAll<HTMLSpanElement>('span.has-error');
    expect(allSpanError).toHaveLength(4);

    const foundSpan = Array.from(allSpanError).find((spanItem: HTMLSpanElement) => (
      spanItem?.textContent?.includes('Last name')
    ));

    expect(foundSpan).toBeUndefined();
    renderResult.unmount();
  });

  it('should clear email name error message after entering information', () => {
    const renderResult = render(<SignUpForm />);
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;

    const sendButton = mainContainer.querySelectorAll('button')[0];
    fireEvent(sendButton, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(mainContainer.querySelectorAll<HTMLSpanElement>('span.has-error')).toHaveLength(5);

    const email = mainContainer.querySelector<HTMLInputElement>('#email');
    email && fireEvent.change(email, {target: {value: 'a'}});
    const allSpanError = mainContainer.querySelectorAll<HTMLSpanElement>('span.has-error');
    expect(allSpanError).toHaveLength(4);

    const foundSpan = Array.from(allSpanError).find((spanItem: HTMLSpanElement) => (
      spanItem?.textContent?.includes('Email')
    ));

    expect(foundSpan).toBeUndefined();
    renderResult.unmount();
  });

  it('should clear the eu resident select error message after entering information', () => {
    const renderResult = render(<SignUpForm />);
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;

    const sendButton = mainContainer.querySelectorAll('button')[0];
    fireEvent(sendButton, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(mainContainer.querySelectorAll<HTMLSpanElement>('span.has-error')).toHaveLength(5);

    const selectContainer = mainContainer.querySelector<HTMLDivElement>('div.Select-container');

    selectContainer && fireEvent(selectContainer, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const listbox = mainContainer.querySelectorAll<HTMLLIElement>('li[role=option]');

    fireEvent(listbox[1], new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const combobox = selectContainer?.childNodes[0] as HTMLDivElement ?? <div></div>;
    const input = combobox.childNodes[0] as HTMLInputElement;
    expect(input.getAttribute('value')).toBe('Yes');

    const allSpanError = mainContainer.querySelectorAll<HTMLSpanElement>('span.has-error');
    expect(allSpanError).toHaveLength(4);

    const foundSpan = Array.from(allSpanError).find((spanItem: HTMLSpanElement) => (
      spanItem?.textContent?.includes('EU Resident')
    ));

    expect(foundSpan).toBeUndefined();
    renderResult.unmount();
  });

  it('should clear the checkbox error message after checking at least one', () => {
    const renderResult = render(<SignUpForm />);
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;

    const sendButton = mainContainer.querySelectorAll('button')[0];
    fireEvent(sendButton, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(mainContainer.querySelectorAll<HTMLSpanElement>('span.has-error')).toHaveLength(5);

    const checkboxes = mainContainer.querySelectorAll<HTMLInputElement>('input[type=checkbox]');
    fireEvent(checkboxes[0], new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));
    fireEvent(checkboxes[1], new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));
    fireEvent(checkboxes[1], new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const allSpanError = mainContainer.querySelectorAll<HTMLSpanElement>('span.has-error');
    expect(allSpanError).toHaveLength(4);

    const foundSpan = Array.from(allSpanError).find((spanItem: HTMLSpanElement) => (
      spanItem?.textContent?.includes('checkbox')
    ));

    expect(foundSpan).toBeUndefined();
    renderResult.unmount();
  });

  it('should send the form with at least the required fields filled', async () => {
    const renderResult = render(<SignUpForm />);
    const { container } = renderResult;
    const apiCallMock = jest.spyOn(ApiCall, 'default').mockResolvedValue({
      status: 'success',
      message: 'SUCCESS_MESSAGE',
    });

    const mainContainer = container.firstChild as HTMLDivElement;

    const [firstName, lastName, email, organization] = mainContainer.querySelectorAll<HTMLInputElement>('input[type=text]');
    firstName && fireEvent.change(firstName, {target: {value: 'FIRST_NAME'}});
    lastName && fireEvent.change(lastName, {target: {value: 'LAST_NAME'}});
    email && fireEvent.change(email, {target: {value: 'SOME_EMAIL'}});
    organization && fireEvent.change(organization, {target: {value: 'SOME_ORG'}});

    const selectContainer = mainContainer.querySelector<HTMLDivElement>('div.Select-container');
    expect(selectContainer).not.toBeNull();

    selectContainer && fireEvent(selectContainer, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const listbox = selectContainer?.childNodes[1] as HTMLUListElement;
    fireEvent(listbox.childNodes[1], new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const checkboxes = mainContainer.querySelectorAll<HTMLInputElement>('input[type=checkbox]');
    fireEvent(checkboxes[0], new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const sendButton = mainContainer.querySelectorAll('button')[0];
    await waitFor(() => {
      fireEvent(sendButton, new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }));
    });

    expect(mainContainer.childNodes).toHaveLength(3);
    const [statusSpan, msgSpan] = mainContainer.querySelectorAll<HTMLSpanElement>('span');

    expect(statusSpan.textContent).toBe('Status: success');
    expect(msgSpan.textContent).toBe('Message: SUCCESS_MESSAGE');

    apiCallMock.mockRestore();
    renderResult.unmount();
  });

  it('should show the rejected api call request data', async () => {
    const renderResult = render(<SignUpForm />);
    const { container } = renderResult;
    const apiCallMock = jest.spyOn(ApiCall, 'default').mockRejectedValue({
      status: 'error',
      message: 'ERROR_MESSAGE',
    });

    const mainContainer = container.firstChild as HTMLDivElement;

    const [firstName, lastName, email, organization] = mainContainer.querySelectorAll<HTMLInputElement>('input[type=text]');
    firstName && fireEvent.change(firstName, {target: {value: 'FIRST_NAME'}});
    lastName && fireEvent.change(lastName, {target: {value: 'LAST_NAME'}});
    email && fireEvent.change(email, {target: {value: 'SOME_EMAIL'}});
    organization && fireEvent.change(organization, {target: {value: 'SOME_ORG'}});

    const selectContainer = mainContainer.querySelector<HTMLDivElement>('div.Select-container');
    expect(selectContainer).not.toBeNull();

    selectContainer && fireEvent(selectContainer, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const listbox = selectContainer?.childNodes[1] as HTMLUListElement;
    fireEvent(listbox.childNodes[1], new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const checkboxes = mainContainer.querySelectorAll<HTMLInputElement>('input[type=checkbox]');
    fireEvent(checkboxes[0], new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const sendButton = mainContainer.querySelectorAll('button')[0];
    await waitFor(() => {
      fireEvent(sendButton, new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }));
    });

    expect(mainContainer.childNodes).toHaveLength(3);
    const [statusSpan, msgSpan] = mainContainer.querySelectorAll<HTMLSpanElement>('span');

    expect(statusSpan.textContent).toBe('Status: error');
    expect(msgSpan.textContent).toBe('Message: ERROR_MESSAGE');

    apiCallMock.mockRestore();
    renderResult.unmount();
  });
});


