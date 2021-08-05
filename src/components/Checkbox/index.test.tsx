import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import Checkbox from '.';

let renderResult: RenderResult = render(<React.Fragment></React.Fragment>);

describe('Checkbox', () => {

  beforeEach(() => {
    renderResult = render(<Checkbox id="SOME_ID" label="SOME_LABEL" value="SOME_VALUE" />);
  });

  afterEach(() => {
    renderResult.unmount();
  });

  it('renders the component', () => {
    const { container } = renderResult;

    expect(container.childElementCount).toBe(1);

    const labelElement = container.childNodes[0] as HTMLLabelElement;

    expect(container.childElementCount).toBe(1);
    expect(labelElement).toHaveClass('Checkbox-container');
    expect(labelElement.childElementCount).toBe(3);
  });

  it('should associate the label with the input checkbox', () => {
    const { container } = renderResult;
    const labelElement = container.childNodes[0] as HTMLLabelElement;
    const inputElement = labelElement.childNodes[1] as HTMLInputElement;

    expect(labelElement.htmlFor).toBe(inputElement.id);
    expect(labelElement.htmlFor).toBe(inputElement.name);
  });
});


