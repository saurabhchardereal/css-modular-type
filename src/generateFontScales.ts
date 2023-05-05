import { defaultGeneratorConfig } from "./config";
import { GeneratorOpts } from "./types";

const generateFontScales = (opts: GeneratorOpts) => {
  let {
    minScreenWidth,
    maxScreenWidth,
    minFontSize,
    maxFontSize,
    minRatio,
    maxRatio,
    minStep,
    maxStep,
    precision,
    prefix,
    rootFontSize,
    suffixType,
    suffixValues,
    unit,
    insertMinMaxFontAsVariables,
  } = opts;

  if (minStep < 0 || maxStep < 0) {
    throw new Error("minStep or maxStep cannot be negative values!");
  }

  if (typeof suffixValues === "function") {
    suffixValues = suffixValues(defaultGeneratorConfig.suffixValues);
  }

  // If the user hasn't provided sufficient suffixes to map to total steps
  // throw an error
  if (suffixType === "values" && suffixValues.length <= maxStep + minStep) {
    throw new Error(
      "Insufficient suffixes passed.\n" +
        `Number of steps: ${minStep}(minstep) + ${maxStep}(maxStep) + 1(baseStep) = ${
          minStep + maxStep + 1
        }\n` +
        `Number of suffixes: ${suffixValues.length}\n` +
        `Current suffix list: ${suffixValues.toString()}\n`
    );
  }

  const stepsMap = new Map<string, string>();
  const baseIndex = minStep === 0 ? 0 : minStep;
  const toRem = (pxValue: number) => pxValue / rootFontSize;

  if (unit !== "px") {
    minScreenWidth = toRem(minScreenWidth);
    maxScreenWidth = toRem(maxScreenWidth);
    minFontSize = toRem(minFontSize);
    maxFontSize = toRem(maxFontSize);
  }

  for (let step = 0; step <= maxStep + minStep; step++) {
    const power = step - baseIndex; // power to raise ratio to
    const minStepRatio = Math.pow(minRatio, power);
    const maxStepRatio = Math.pow(maxRatio, power);

    const fsMinSize = minFontSize * minStepRatio;
    const fsMaxSize = maxFontSize * maxStepRatio;

    const slope = (fsMaxSize - fsMinSize) / (maxScreenWidth - minScreenWidth);
    const yIntersect = (fsMinSize - slope * minScreenWidth).toFixed(precision);
    const slopeVw = (slope * 100).toFixed(precision);
    const fsMinFinal = `${fsMinSize.toFixed(precision)}${unit}`;
    const fsMaxFinal = `${fsMaxSize.toFixed(precision)}${unit}`;

    const key =
      suffixType === "values"
        ? `${prefix}${suffixValues[step]}`
        : `${prefix}${power}`;
    let value = `clamp(${fsMinFinal}, ${slopeVw}vw + ${yIntersect}${unit}, ${fsMaxFinal})`;

    if (insertMinMaxFontAsVariables) {
      const minkey =
        suffixType === "values"
          ? `${prefix}min-${suffixValues[step]}`
          : `${prefix}min-${power}`;
      const maxKey =
        suffixType === "values"
          ? `${prefix}max-${suffixValues[step]}`
          : `${prefix}max-${power}`;

      value = `clamp(var(--${minkey}), ${slopeVw}vw + ${yIntersect}${unit}, var(--${maxKey}))`;
      stepsMap.set(minkey, fsMinFinal);
      stepsMap.set(maxKey, fsMaxFinal);
    }

    stepsMap.set(key, value);
  }

  return stepsMap;
};

export = generateFontScales;
