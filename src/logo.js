$(document).ready(function () {

  var mainImage = [
    "#ifdef GL_ES",
    "precision mediump float;",
    "#endif",


    "vec4 when_eq(vec4 x, vec4 y) {",
    "  return 1.0 - abs(sign(x - y));",
    "}",

    "vec4 when_neq(vec4 x, vec4 y) {",
    "  return abs(sign(x - y));",
    "}",

    "vec4 when_gt(vec4 x, vec4 y) {",
    "  return max(sign(x - y), 0.0);",
    "}",

    "vec4 when_lt(vec4 x, vec4 y) {",
    "  return max(sign(y - x), 0.0);",
    "}",

    "vec4 when_ge(vec4 x, vec4 y) {",
    "  return 1.0 - when_lt(x, y);",
    "}",

    "vec4 when_le(vec4 x, vec4 y) {",
    "  return 1.0 - when_gt(x, y);",
    "}",


    "float when_eq(float x, float y) {",
    "  return 1.0 - abs(sign(x - y));",
    "}",

    "float when_neq(float x, float y) {",
    "  return abs(sign(x - y));",
    "}",

    "float when_gt(float x, float y) {",
    "  return max(sign(x - y), 0.0);",
    "}",

    "float when_lt(float x, float y) {",
    "  return max(sign(y - x), 0.0);",
    "}",

    "float when_ge(float x, float y) {",
    "  return 1.0 - when_lt(x, y);",
    "}",

    "float when_le(float x, float y) {",
    "  return 1.0 - when_gt(x, y);",
    "}",


    "vec4 and(vec4 a, vec4 b) {",
    "  return a * b;",
    "}",

    "vec4 or(vec4 a, vec4 b) {",
    "  return min(a + b, 1.0);",
    "}",

    "vec4 not(vec4 a) {",
    "  return 1.0 - a;",
    "}",


    "float and(float a, float b) {",
    "  return a * b;",
    "}",

    "float or(float a, float b) {",
    "  return min(a + b, 1.0);",
    "}",

    "float not(float a) {",
    "  return 1.0 - a;",
    "}",


    "float normpdf( in float x, in float sigma )",
    "{",
    "  return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;",
    "}",


    "void mainImage( out vec4 fragColor, in vec2 fragCoord )",
    "{",


    "    // Setup ========================================================================",

    "    vec2 uv = fragCoord.xy / uResolution.xy;",
    "    vec4 baseSample = textTexture(uv);",
    "    float time = uTime / 1.0;",
    "    float onePixel = 1.0 / uResolution.y;",

    "    vec4 finalColour = vec4(0.0);",


    "    // Create Darkness ==============================================================",

    "    const int darknessRadius = 16;",

    "    vec2 stepUV = vec2(0.0);",
    "    vec2 darkestUV = uv;",

    "    vec4 stepSample = vec4(0.0);",
    "    vec4 darkestSample = baseSample;",

    "    float stepDistance = 1.0;",
    "    float darkestDistance = 0.0;",

    "    vec2 maxDistanceUV = uv + (vec2(0.0, float(darknessRadius) + onePixel) / uResolution.xy);",
    "    float maxDistance = distance(uv, maxDistanceUV);",

    "    // Find the darkest sample and some relevant meta data within a radius.",
    "    //   Note: You may notice some artifacts in our darkness. This is due to",
    "    //   us making steps on a `+=2` basis in the interest of performance. Play!",
    "    for (int i = -darknessRadius; i <= darknessRadius; i += 2) {",
    "        for (int j = -darknessRadius; j <= darknessRadius; j += 2) {",
    "            stepUV = uv + vec2(float(i), float(j)) / uResolution.xy;",
    "            stepSample = textTexture(stepUV);",
    "            stepDistance = max(0.0, distance(uv, stepUV));",

    "            float stepDarkestSampleWeight = 1.0 - smoothstep(0.0, maxDistance, stepDistance);",

    "            vec4 mixedStep = mix(baseSample, stepSample, stepDarkestSampleWeight);",

    "            if (mixedStep == min(darkestSample, mixedStep) && stepDistance <= maxDistance) {",

    "                if (mixedStep == darkestSample) {",
    "                    darkestDistance = min(stepDistance, darkestDistance);",
    "                    if (darkestDistance == stepDistance) {",
    "                      darkestUV = stepUV;",
    "                    }",
    "                }",
    "                else {",
    "                    darkestDistance = stepDistance;",
    "                }",

    "                darkestSample = mixedStep;",
    "            }",
    "        }",
    "    }",

    "    float darkestSampleWeight = 1.0 - smoothstep(0.0, maxDistance, darkestDistance);",
    "    darkestSampleWeight = smoothstep(0.0, 0.85, darkestSampleWeight);",


    "    // Create Heat Points ===========================================================",

    "    float heatDistanceScale = 8.0; // Larger equates to smaller spread",

    "    // Define 3 heat points",
    "    float heatPoint1X = (0.5 + sin(time * 1.05) / 4.0);",
    "    float heatPoint1Y = (0.5 - cos(time * 2.5) / 4.0);",
    "    vec2 heatPoint1Uv = vec2(heatPoint1X, heatPoint1Y);",

    "    float heatPoint2X = (0.5 + sin(time * 1.0) / 4.0);",
    "    float heatPoint2Y = (0.5 - cos(time * 2.0) / 4.0);",
    "    vec2 heatPoint2Uv = vec2(heatPoint2X, heatPoint2Y);",

    "    float heatPoint3X = (0.5 + sin(time * 3.0) / 4.0);",
    "    float heatPoint3Y = (0.5 - cos(time * 0.5) / 4.0);",
    "    vec2 heatPoint3Uv = vec2(heatPoint3X, heatPoint3Y);",

    "    // Calculate distances from current UV and combine",
    "    float heatPoint1Dist = distance(uv, heatPoint1Uv);",
    "    float heatPoint2Dist = distance(uv, heatPoint2Uv);",
    "    float heatPoint3Dist = distance(uv, heatPoint3Uv);",
    "    float combinedDist = (heatPoint1Dist * heatPoint2Dist * heatPoint3Dist);",

    "    // Invert and scale",
    "    float amount = 1.0 - smoothstep(0.2, 1.55, combinedDist * heatDistanceScale);",


    "    // Single Pass Blur =============================================================",

    "    const int diameter = 5;",
    "    const int kSize = (diameter - 1) / 2;",
    "    float kernel[diameter];",

    "    // Create the 1-D kernel",
    "    float sigma = 7.0;",
    "    float Z = 0.0;",
    "    for (int i = 0; i <= kSize; i++) {",
    "        kernel[kSize + i] = kernel[kSize - i] = normpdf(float(i), sigma);",
    "    }",

    "    // Get the normalization factor (as the gaussian has been clamped)",
    "    for (int i = 0; i < diameter; i++) {",
    "        Z += kernel[i];",
    "    }",

    "    for (int i = -kSize; i <= kSize; i++) {",
    "        for (int j = -kSize; j <= kSize; j++) {",
    "            stepUV = uv + vec2(float(i), float(j)) / uResolution.xy;",
    "            stepSample = textTexture(stepUV);",
    "            stepDistance = max(0.0, distance(uv, darkestUV));",

    "            float stepDarkestSampleWeight = 1.0 - smoothstep(0.0, maxDistance, stepDistance);",
    "            stepSample = mix(stepSample,",
    "                             darkestSample,",
    "                             ((stepDarkestSampleWeight / 2.0) * amount) * when_le(stepDistance, maxDistance));",

    "            finalColour += kernel[kSize + j] * kernel[kSize + i] * stepSample;",
    "        }",
    "    }",

    "    finalColour = vec4(finalColour/(Z*Z));",


    "    // Mix Blur and Darkness  =======================================================",

    "    finalColour = mix(finalColour, darkestSample, (darkestSampleWeight * 0.5) * amount);// * amount);",


    "    fragColor = finalColour;",
    "}"
  ].join("\n");

  var text = new Blotter.Text("observation", {
    family : "'adobe-garamond-pro', serif",
    size : 32,
    fill : "#171717"
  });

  var material = new Blotter.ShaderMaterial(mainImage, {
    options : {
      uTime : { type : "1f", value : 0.0 }
    }
  });
  var blotter = new Blotter(material, {
    texts : text
  });

  var elem = $("#logo");
  var myScope = blotter.forText(text);
  var startTime = new Date().getTime();

  blotter.on("ready", function () {
    elem.html(myScope.domElement);
  });

  myScope.on("render", function () {
    var time = (new Date().getTime() - startTime) / 1000;
    myScope.material.uniforms.uTime.value = time;
  });


});