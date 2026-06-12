import React from 'react';
import { View, Image, Text } from 'react-native';
import shared from '../styles/styles';

const Logo = ({ titulo, subtitulo }) => {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', marginBottom: 8}}>
      <Image
        style={shared.logo}
        source={require('../../assets/logo/logo.png')}
      />
      <Text style={shared.titulo}>{titulo}</Text>
      <Text style={shared.subtitulo}>{subtitulo}</Text>
    </View>
  );
};

export default Logo;
