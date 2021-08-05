import React, { useRef, createRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Select, { Option, ForwardingSelectProps } from '.';
import { delay } from '../../utils/testHelper';


describe('Select', () => {
  it('renders the component', () => {
    const mockSelectedChangeFn = jest.fn();

    const renderResult = render(
      <Select htmlFor="euResident" onSelectedOptionChange={mockSelectedChangeFn}>
        <Option id="Yes" label="Yes" />
        <Option id="No" label="No" />
      </Select>
    );
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;

    expect(mainContainer).toHaveClass('Select-container');
    expect(mainContainer.childNodes).toHaveLength(2);

    const combobox = mainContainer.childNodes[0] as HTMLDivElement;
    expect(combobox.getAttribute('aria-label')).toBe('euResident');
    expect(combobox.getAttribute('aria-expanded')).toBe('false');

    const input = combobox.childNodes[0] as HTMLInputElement;
    expect(combobox.childNodes).toHaveLength(2);
    expect(input.getAttribute('value')).toBe('- Select one -');

    const listbox = mainContainer.childNodes[1] as HTMLUListElement;
    expect(listbox.childNodes).toHaveLength(3);

    expect(listbox.getAttribute('role')).toBe(combobox.getAttribute('aria-haspopup'));

    renderResult.unmount();
  });

  it('should open if user clicks it', () => {
    const mockSelectedChangeFn = jest.fn();

    const renderResult = render(
      <Select htmlFor="euResident" onSelectedOptionChange={mockSelectedChangeFn}>
        <Option id="Yes" label="Yes" />
        <Option id="No" label="No" />
      </Select>
    );
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;
    const combobox = mainContainer.childNodes[0] as HTMLDivElement;

    expect(combobox.getAttribute('aria-expanded')).toBe('false');

    fireEvent(mainContainer, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(combobox.getAttribute('aria-expanded')).toBe('true');

    renderResult.unmount();
  });

  it('should change the value if user clicks one of the shown options', () => {
    const mockSelectedChangeFn = jest.fn();

    const renderResult = render(
      <Select htmlFor="euResident" onSelectedOptionChange={mockSelectedChangeFn}>
        <Option id="Yes" label="Yes" />
        <Option id="No" label="No" />
      </Select>
    );
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;
    const combobox = mainContainer.childNodes[0] as HTMLDivElement;

    fireEvent(mainContainer, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(combobox.getAttribute('aria-expanded')).toBe('true');

    const input = combobox.childNodes[0] as HTMLInputElement;
    expect(input.getAttribute('value')).toBe('- Select one -');

    const listbox = mainContainer.childNodes[1] as HTMLUListElement;
    expect(listbox.childNodes).toHaveLength(3);

    fireEvent(listbox.childNodes[1], new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(combobox.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('value')).toBe('Yes');

    renderResult.unmount();
  });

  it('should register accessibility for hovered element', async () => {
    const mockSelectedChangeFn = jest.fn();

    const renderResult = render(
      <Select htmlFor="euResident" onSelectedOptionChange={mockSelectedChangeFn}>
        <Option id="Yes" label="Yes" />
        <Option id="No" label="No" />
      </Select>
    );
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;
    const combobox = mainContainer.childNodes[0] as HTMLDivElement;

    fireEvent(mainContainer, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const input = combobox.childNodes[0] as HTMLInputElement;
    expect(input.getAttribute('aria-activedescendant')).toBe(null);

    const listbox = mainContainer.childNodes[1] as HTMLUListElement;

    fireEvent.mouseOver(listbox.childNodes[1]);
    await delay(100);

    expect(input.getAttribute('aria-activedescendant')).toBe('Yes');

    fireEvent.mouseLeave(listbox.childNodes[1]);
    await delay(100);

    expect(input.getAttribute('aria-activedescendant')).toBe(null);

    renderResult.unmount();
  });

  it('should close the dropdown if clicked outside', async () => {
    const mockSelectedChangeFn = jest.fn();

    const renderResult = render(
      <React.Fragment>
        <Select htmlFor="euResident" onSelectedOptionChange={mockSelectedChangeFn}>
          <Option id="Yes" label="Yes" />
          <Option id="No" label="No" />
        </Select>
        <br />
        <div style={{padding: '40px', marginTop: '40px'}} >
          <span>SOME TEXT</span>
        </div>
      </React.Fragment>
    );
    const { container } = renderResult;
    const divContainer = container.childNodes[1] as HTMLDivElement;

    const mainContainer = container.childNodes[0] as HTMLDivElement;

    const combobox = mainContainer.childNodes[0] as HTMLDivElement;

    fireEvent(mainContainer, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(combobox.getAttribute('aria-expanded')).toBe('true');

    fireEvent.mouseDown(divContainer)

    await delay(100);

    expect(combobox.getAttribute('aria-expanded')).toBe('false');

    renderResult.unmount();
  });

  it('should be able to reset to default with forwarded ref', () => {
    const mockSelectedChangeFn = jest.fn();
    const testRef = createRef() as React.MutableRefObject<ForwardingSelectProps>;

    const renderResult = render(
      <Select htmlFor="euResident" onSelectedOptionChange={mockSelectedChangeFn} ref={testRef}>
        <Option id="Yes" label="Yes" />
        <Option id="No" label="No" />
      </Select>
    );
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;
    const combobox = mainContainer.childNodes[0] as HTMLDivElement;

    fireEvent(mainContainer, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const input = combobox.childNodes[0] as HTMLInputElement;
    expect(input.getAttribute('value')).toBe('- Select one -');

    const listbox = mainContainer.childNodes[1] as HTMLUListElement;
    fireEvent(listbox.childNodes[1], new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(input.getAttribute('value')).toBe('Yes');
    act(() => {
      testRef?.current?.resetToDefault();
    })
    expect(input.getAttribute('value')).toBe('- Select one -');

    renderResult.unmount();
  });
});


