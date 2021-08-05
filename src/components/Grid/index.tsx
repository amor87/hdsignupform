import React, { useEffect, useState, CSSProperties } from 'react';

/* Styles */
import './index.scss';

function getColumnStyle (
  screenWidth: number,
  from: GridColumns,
  to: GridColumns,
  smallScreenStyle: CSSProperties = {},
  fullResStyle: CSSProperties = {},
): React.CSSProperties {
  if (screenWidth >= 768) {
    return {
      ...fullResStyle,
      gridColumn: `${from} / ${to}`
    }
  }

  return smallScreenStyle
}

function getWindowWidth(): number {
  return window.innerWidth;
}

interface BaseProps {
  children: React.ReactNode
}

type GridColumns =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
;

interface ColProps extends BaseProps {
  from: GridColumns;
  to: GridColumns;
  style?: CSSProperties;
  smallScreenStyle?: CSSProperties;
  fullResStyle?: CSSProperties;
}

function Col(props: ColProps): JSX.Element {
  const [screenWidth, setScreenWidth] = useState<number>(getWindowWidth());
  const style = getColumnStyle(
    screenWidth,
    props.from,
    props.to,
    props.smallScreenStyle,
    props.fullResStyle
  );

  const handleWidthResize = (): void => {
    setScreenWidth(getWindowWidth());
  };

  useEffect(() => {
    window.addEventListener('resize', handleWidthResize);

    return () => {
      window.removeEventListener('resize', handleWidthResize)
    };
  }, []);

  return (
    <div className="col" style={{...(props.style ?? {}), ...style}}>
      {props.children}
    </div>
  );
}


function Row(props: BaseProps): JSX.Element {
  return (
    <div className="grid-row">{props.children}</div>
  );
}

const grid = {
  Col,
  Row,
}

export default grid;
