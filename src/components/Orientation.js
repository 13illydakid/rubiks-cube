
export const arrayIndexAsCubeFace = [ "top", "front", "left", "right", "back", "bottom", ]

const cubeSyntaxTranslation = {
  side2: "right",  // 3
  side4: "left",   // 2
  side3: "back",   // 4
  side0: "front",  // 1
  side1: "top",    // 0
  side5: "bottom", // 5
};

export const YellowTop = {
  "red": [ "green", "blue", "orange", "red", "yellow", "white" ],
  "blue": [ "red", "orange", "green", "blue", "yellow", "white" ],
  "orange": [ "blue", "green", "red", "orange", "yellow", "white" ],
  "green": [ "orange", "red", "blue", "green", "yellow", "white" ]
}

export const RedTop = {
  "yellow": [ "blue", "green", "white", "yellow", "red", "orange" ],
  "green": [ "yellow", "white", "blue", "green", "red", "orange" ],
  "white": [ "green", "blue", "yellow", "white", "red", "orange" ],
  "blue": [ "white", "yellow", "green", "blue", "red", "orange" ]
}

export const BlueTop = {
  "red": [ "yellow", "white", "orange", "red", "blue", "green" ],
  "white": [ "red", "orange", "yellow", "white", "blue", "green" ],
  "orange": [ "white", "yellow", "red", "orange", "blue", "green" ],
  "yellow": [ "orange", "red", "white", "yellow", "blue", "green" ]
}

export const OrangeTop = {
  "yellow": [ "green", "blue", "white", "yellow", "orange", "red" ],
  "blue": [ "yellow", "white", "green", "blue", "orange", "red" ],
  "white": [ "blue", "green", "yellow", "white", "orange", "red" ],
  "green": [ "white", "yellow", "blue", "green", "orange", "red" ]
}

export const GreenTop = {
  "red": [ "white", "yellow", "orange", "red", "green", "blue" ],
  "yellow": [ "red", "orange", "white", "yellow", "green", "blue" ],
  "orange": [ "yellow", "white", "red", "orange", "green", "blue" ],
  "white": [ "orange", "red", "yellow", "white", "green", "blue" ]
}

export const WhiteTop = {
  "red": [ "blue", "green", "orange", "red", "white", "yellow" ],
  "green": [ "red", "orange", "blue", "green", "white", "yellow" ],
  "orange": [ "green", "blue", "red", "orange", "white", "yellow" ],
  "blue": [ "orange", "red", "green", "blue", "white", "yellow" ]
}
