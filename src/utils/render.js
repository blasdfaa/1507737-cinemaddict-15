import { RenderPosition } from './const';
import Abstract from '../view/abstract';

export const render = (container, child, place, arg = {}) => {
  if (container instanceof Abstract) {
    container = container.renderElement();
  }

  if (child instanceof Abstract) {
    child = child.renderElement(arg);
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.AFTEREND:
      container.after(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const removeComponent = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.renderElement().remove();
  component.removeElement();
};
