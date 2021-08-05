import { render } from '@testing-library/react';
import Header from '.';


describe('App', () => {
  it('renders the component', () => {
    const renderResult = render(<Header />);
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;

    expect(mainContainer).toHaveClass('SUFHeader-container');
    expect(mainContainer.childNodes).toHaveLength(2);
    expect(mainContainer.childNodes[0].nodeName.toLowerCase()).toBe('h2');
    expect(mainContainer.childNodes[1].nodeName.toLowerCase()).toBe('label');
  });
});


