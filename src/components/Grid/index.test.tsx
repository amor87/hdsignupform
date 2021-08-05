import { render, act } from '@testing-library/react';
import Grid from '.';
import { delay } from '../../utils/testHelper';

window.resizeTo = function resizeTo(width, height) {
  Object.assign(this, {
    innerWidth: width,
    innerHeight: height,
    outerWidth: width,
    outerHeight: height
  }).dispatchEvent(new this.Event('resize'));
};

describe('Grid', () => {
  describe('Row', () => {
    it('renders the component', () => {
      const renderResult = render(<Grid.Row><div></div></Grid.Row>);
      const { container } = renderResult;
      const mainContainer = container.firstChild;

      expect(mainContainer).toHaveClass('grid-row');
      renderResult.unmount();
    });
  });

  describe('Col', () => {
    it('renders the component', () => {
      const renderResult = render(
        <Grid.Col from="1" to="13">
          <div></div>
        </Grid.Col>);
      const { container } = renderResult;
      const mainContainer = container.firstChild;

      expect(mainContainer).toHaveClass('col');
      expect(mainContainer).toHaveStyle({
        'grid-column': '1 / 13'
      });

      renderResult.unmount();
    });

    it('should not have some styles on small screen size', async () => {
      const originalWidth = window.innerWidth;
      const originalHeight = window.innerHeight;

      const renderResult = render(
        <Grid.Col from="1" to="13">
          <div></div>
        </Grid.Col>);
      const { container } = renderResult;
      const mainContainer = container.firstChild as HTMLDivElement;

      expect(mainContainer).toHaveClass('col');
      expect(mainContainer).toHaveStyle({
        'grid-column': '1 / 13'
      });

      act(() => {
        window.resizeTo(500, 500);
      });

      await delay(100);
      expect(mainContainer).toHaveClass('col');
      const containerStyles = mainContainer.style as CSSStyleDeclaration;
      expect(containerStyles.gridColumn).toBe('');

      act(() => {
        window.resizeTo(originalWidth, originalHeight);
      });

      expect(mainContainer).toHaveStyle({
        'grid-column': '1 / 13'
      });

      renderResult.unmount();
    });

    it('should include small screen styles if passed', async () => {
      const originalWidth = window.innerWidth;
      const originalHeight = window.innerHeight;

      const renderResult = render(
        <Grid.Col from="1" to="13" smallScreenStyle={{color: 'red'}}>
          <div></div>
        </Grid.Col>);
      const { container } = renderResult;
      const mainContainer = container.firstChild as HTMLDivElement;

      expect(mainContainer).toHaveStyle({
        'grid-column': '1 / 13'
      });

      act(() => {
        window.resizeTo(500, 500);
      });

      await delay(100);

      expect(mainContainer).toHaveStyle('color: red');

      act(() => {
        window.resizeTo(originalWidth, originalHeight);
      });

      renderResult.unmount();
    });

    it('should include style for all resolutions', async () => {
      const originalWidth = window.innerWidth;
      const originalHeight = window.innerHeight;

      const renderResult = render(
        <Grid.Col from="1" to="13" style={{color: 'red'}}>
          <div></div>
        </Grid.Col>);
      const { container } = renderResult;
      const mainContainer = container.firstChild as HTMLDivElement;

      expect(mainContainer).toHaveStyle({
        'grid-column': '1 / 13',
        color: 'red',
      });

      act(() => {
        window.resizeTo(500, 500);
      });

      await delay(100);

      expect(mainContainer).toHaveStyle('color: red');

      act(() => {
        window.resizeTo(originalWidth, originalHeight);
      });

      renderResult.unmount();
    });

    it('should include style for large resolutions only', async () => {
      const originalWidth = window.innerWidth;
      const originalHeight = window.innerHeight;

      const renderResult = render(
        <Grid.Col from="1" to="13" fullResStyle={{color: 'red'}}>
          <div></div>
        </Grid.Col>);
      const { container } = renderResult;
      const mainContainer = container.firstChild as HTMLDivElement;

      expect(mainContainer).toHaveStyle({
        'grid-column': '1 / 13',
        color: 'red',
      });

      act(() => {
        window.resizeTo(500, 500);
      });

      await delay(100);

      expect(mainContainer).toHaveClass('col');
      const containerStyles = mainContainer.style as CSSStyleDeclaration;
      expect(containerStyles.gridColumn).toBe('');
      expect(containerStyles.color).toBe('');

      act(() => {
        window.resizeTo(originalWidth, originalHeight);
      });

      renderResult.unmount();
    });
  });
});


