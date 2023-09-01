import { ConfigPlugin, withInfoPlist } from 'expo/config-plugins';

const withRNMultipeer: ConfigPlugin = config => {
    return withInfoPlist(config, (config) => {
        const infoPlist = config.modResults;
        infoPlist.NSLocalNetworkUsageDescription = "Local network is used to connect with peers";
        infoPlist.NSBonjourServices = ["_multi-peer._tcp", "_multi-peer._udp"];
        return config;
      });
};

export default withRNMultipeer;