import { render } from '@testing-library/react';
import App from '.';
import { getElementProp } from '../utils/testHelper';


describe('App', () => {
  it('renders the component', () => {
    const renderResult = render(<App />);
    const { container } = renderResult;

    const mainContainer = container.firstChild as HTMLDivElement;

    expect(mainContainer).toHaveClass('App');
    expect(getElementProp(mainContainer.firstChild as HTMLDivElement, 'className')).toContain('SignUp');

    renderResult.unmount();
  });
});


