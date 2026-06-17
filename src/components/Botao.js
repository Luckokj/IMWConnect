import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const Botao = ({
  titulo,
  onPress,
  style,
  disabled,
}) => {
  // simple, reusable button with optional disabled state and style override
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[estilo.botao, style, disabled && estilo.disabled]}
      activeOpacity={0.85}
      disabled={disabled}
    >
      <Text style={estilo.textoBotao}>{titulo}</Text>
    </TouchableOpacity>
  );
};


const estilo = StyleSheet.create({
  botao: {
    backgroundColor: '#3AA4BA',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    // make button fill the card width by default; callers can override via style prop
    width: '100%',
    borderRadius: 12,
    marginVertical: 16,
    alignSelf: 'center',
    elevation: 6,
  },

  disabled: {
    opacity: 0.6,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Botao;
