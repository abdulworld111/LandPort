module.exports = () => {
    return {
      expo: {
        name: "LandPortApp",
        slug: "LandPortApp",
        android: {
          googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        },
        // Other configurations...
        extra: {
          eas: {
            projectId: "c1a89a23-7ae3-409f-827b-1765cf91b062",
          },
        },
        android: {
          "package": "com.sasorian.LandPortApp",
        },
      },
    };
  };