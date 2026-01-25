// Quality presets for the Three.js landing scene
export const qualityPresets = {
  low: {
    particleCount: 15,
    dnaCount: 20,
    sparklesCount: 100,
    shadowsEnabled: false,
    bloomIntensity: 0.8,
    postProcessing: false,
  },
  medium: {
    particleCount: 25,
    dnaCount: 30,
    sparklesCount: 200,
    shadowsEnabled: false,
    bloomIntensity: 1.0,
    postProcessing: true,
  },
  high: {
    particleCount: 35,
    dnaCount: 40,
    sparklesCount: 300,
    shadowsEnabled: true,
    bloomIntensity: 1.2,
    postProcessing: true,
  },
};
