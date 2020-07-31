import DefaultIonicons from '@expo/vector-icons/build/Ionicons';
import DefaultMaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  name: string;
  size?: number;
  style?: any;
  lightColor?: string;
  darkColor?: string;
};

export const Ionicons = (props: Props) => {
  const theme = useTheme();
  const darkColor = props.darkColor || '#fff';
  const lightColor = props.lightColor || '#ccc';

  return <DefaultIonicons color={theme.dark ? darkColor : lightColor} {...props} />;
};

export const MaterialIcons = (props: Props) => {
  const theme = useTheme();
  const darkColor = props.darkColor || '#fff';
  const lightColor = props.lightColor || '#ccc';

  return <DefaultMaterialIcons color={theme.dark ? darkColor : lightColor} {...props} />;
};

export const Privacy = (props: Omit<Props, 'name'>) => {
  const theme = useTheme();
  const darkColor = props.darkColor || '#fff';
  const lightColor = props.lightColor || '#ccc';
  return (
    <Svg
      fill={theme.dark ? darkColor : lightColor}
      width={props.size}
      height={props.size}
      style={props.style}
      viewBox="0 0 14 14">
      <Path d="M11.5823539,10.4858515 C11.4984898,10.5558646 11.3731446,10.5514078 11.294796,10.4756271 L10.2862868,9.49753697 C10.2279448,9.44082367 10.2092039,9.35627338 10.238364,9.28133103 C10.5560925,8.45697215 10.3481838,7.52867463 9.70643114,6.90628857 C9.06467851,6.28390251 8.10722518,6.08200589 7.25679377,6.38973754 C7.17949639,6.41799009 7.09229844,6.39980497 7.03382197,6.3432368 L6.36001304,5.68971124 C6.32759923,5.65839473 6.31425255,5.61302395 6.32475147,5.56984281 C6.33525038,5.52666168 6.36809331,5.49184608 6.41152162,5.4778609 C6.94456354,5.30938131 7.50188445,5.22429088 8.06253805,5.22578763 C11.1568492,5.22578763 12.6936482,7.6119054 13.0762924,8.30804642 C13.1412359,8.4258471 13.1412359,8.56730253 13.0762924,8.68510321 C12.6932875,9.36706364 12.187309,9.97695493 11.5823539,10.4858515 Z M4.14535529,4.11970803 L12.5808651,12.301732 C12.7456608,12.4614066 12.7457364,12.7203634 12.5810338,12.8801284 C12.4163313,13.0398933 12.1492202,13.0399665 11.9844245,12.880292 L3.54891469,4.69826803 C3.38411897,4.53859345 3.38404343,4.27963656 3.54874595,4.11987163 C3.71344847,3.9601067 3.98055957,3.96003346 4.14535529,4.11970803 Z M4.82962623,6.51797243 L5.8429024,7.50074532 C5.90108523,7.55732743 5.91987756,7.64161263 5.89099394,7.71644004 C5.57597737,8.53980864 5.78452038,9.46563681 6.42490453,10.0867399 C7.06528869,10.7078429 8.02017982,10.9104195 8.86961117,10.6053752 C8.94679688,10.577385 9.03373171,10.5956381 9.09205565,10.6520804 L9.76394513,11.3037451 C9.79635688,11.3350688 9.80969948,11.3804443 9.79919659,11.4236282 C9.7886937,11.4668122 9.75584724,11.5016293 9.71241547,11.5156159 C9.17970085,11.6838577 8.62276233,11.7688358 8.06249586,11.767362 C4.96818472,11.767362 3.43138571,9.38126468 3.04874154,8.68510321 C2.98375282,8.56731351 2.98375282,8.42583612 3.04874154,8.30804642 C3.43152915,7.62632409 3.93724266,7.01662763 4.54189959,6.50787069 C4.62576463,6.43774286 4.75121323,6.44214721 4.82962623,6.51797243 L4.82962623,6.51797243 Z" />
    </Svg>
  );
};
