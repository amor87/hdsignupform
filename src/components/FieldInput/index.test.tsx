import { render } from '@testing-library/react';

import FieldInput from '.';



describe('FieldInput', () => {
  it('renders the component', () => {
    const { container } = render(
      <FieldInput htmlFor="organization" label="Organization">
        <input type="text" id="organization" name="organization" />
      </FieldInput>
    );

    const mainContainer = container.firstChild as HTMLDivElement;

    expect(mainContainer).toHaveClass('FieldInput-container');
    expect(mainContainer.childElementCount).toBe(2);

    const [label, childWrapper] = mainContainer.childNodes;

    expect(label).toHaveProperty('htmlFor');
    expect(label.childNodes.length).toBe(1);
    expect(label.childNodes[0].textContent).toBe('Organization');

    expect(childWrapper).toHaveClass('input-element');
    expect(childWrapper.childNodes.length).toBe(1);
    expect(childWrapper.childNodes[0].nodeName.toLowerCase()).toBe('input');
    expect(childWrapper.childNodes[0]).not.toHaveAttribute('aria-required');
  });

  describe('With Required Props', () => {

    it('adds required accessibility if component has required props', () => {
      const errorMessage = 'Some Error message';
      const { container } = render(
        <FieldInput htmlFor="organization" label="Organization" errorMessage={errorMessage}>
          <input type="text" id="organization" name="organization" />
        </FieldInput>
      );

      const mainContainer = container.firstChild as HTMLDivElement;
      const [label, childWrapper] = mainContainer.childNodes;
      const [ input ] = childWrapper.childNodes;

      expect(label.childNodes.length).toBe(1);

      expect(input.nodeName.toLowerCase()).toBe('input');
      expect(input).toHaveAttribute('aria-required');
    });

    it('adds error content if hasError is true', () => {
      const errorMessage = 'Some Error message';
      const { container } = render(
        <FieldInput htmlFor="organization" label="Organization" errorMessage={errorMessage} hasError>
          <input type="text" id="organization" name="organization" />
        </FieldInput>
      );

      const mainContainer = container.firstChild as HTMLDivElement;
      const [label, childWrapper] = mainContainer.childNodes;
      const [ input ] = childWrapper.childNodes;

      expect(input.nodeName.toLowerCase()).toBe('input');
      expect(input).toHaveAttribute('aria-required');
      expect(input).toHaveClass('error');

      expect(label.childNodes.length).toBe(2);
      const [ span ] = label.childNodes;
      expect(span.textContent).toBe(errorMessage);
      expect(span).toHaveClass('has-error');
    });
  });
});
