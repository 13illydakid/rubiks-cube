
export const arrayIndexAsCubeFace = [ "top", "front", "left", "right", "back", "bottom", ]

const cubeSyntaxTranslation = {
  side2: "right",
  side4: "left",
  side3: "back",
  side0: "front",
  side1: "top",
  side5: "bottom",
};

export const YellowTop = {
  red: [ "yellow", "red", "blue", "green", "orange", "white" ],
  blue: [ "yellow", "blue", "orange", "red", "green", "white" ],
  orange: [ "yellow", "orange", "green", "blue", "red", "white" ],
  green: [ "yellow", "green", "red", "orange", "blue", "white" ],

}

export const RedTop = {
  yellow: [ "red", "yellow", "green", "blue", "white", "orange", ],
  green: [ "red", "green", "white", "yellow", "blue", "orange", ],
  white: [ "red", "white", "blue", "green", "yellow", "orange", ],
  blue: [ "red", "blue", "yellow", "white", "green", "orange", ],
}

export const BlueTop = {
  red: [ "blue", "red", "white", "yellow", "orange", "green", ],
  white: [ "blue", "white", "orange", "red", "yellow", "green", ],
  orange: [ "blue", "orange", "yellow", "white", "red", "green", ],
  yellow: [ "blue", "yellow", "red", "orange", "white", "green", ],
}

export const OrangeTop = {
  yellow: [ "orange", "yellow", "blue", "green", "white", "red", ],
  blue: [ "orange", "blue", "white", "yellow", "green", "red", ],
  white: [ "orange", "white", "green", "blue", "yellow", "red", ],
  green: [ "orange", "green", "yellow", "white", "blue", "red", ],
}

export const GreenTop = {
  red: [ "green", "red", "yellow", "white", "orange", "blue", ],
  yellow: [ "green", "yellow", "orange", "red", "white", "blue", ],
  orange: [ "green", "orange", "white", "yellow", "red", "blue", ],
  white: [ "green", "white", "red", "orange", "yellow", "blue", ],
}

export const WhiteTop = {
  red: [ "white", "red", "green", "blue", "orange", "yellow", ],
  green: [ "white", "green", "orange", "red", "blue", "yellow", ],
  orange: [ "white", "orange", "blue", "green", "red", "yellow", ],
  blue: [ "white", "blue", "red", "orange", "green", "yellow", ],
}
