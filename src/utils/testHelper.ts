export function getElementProp<ElemT extends {}, Key extends keyof ElemT>(element: ElemT, prop: Key): ElemT[Key] | undefined {
  return prop in element ? element[prop] : undefined;
}

export function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
