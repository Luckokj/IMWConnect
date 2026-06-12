import { StyleSheet, Platform } from 'react-native';

const COLORS = {
  background: '#EEF7FA',
  primary: '#1C6885',
  accent: '#3AA4BA',
  inputBg: 'rgba(85,136,163,0.45)',
  white: '#FFFFFF',
  muted: '#334155',
};

const estilos = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? 32 : 20,
  },

  logo: {
    height: 140,
    width: 140,
    marginTop: 12,
    marginBottom: 6,
    resizeMode: 'contain',
  },

  titulo: {
    color: COLORS.primary,
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: 28,
    marginBottom: 4,
  },

  subtitulo: {
    color: COLORS.primary,
    marginTop: 4,
    marginBottom: 14,
    fontWeight: '600',
    fontSize: 16,
  },

  texto: {
    color: COLORS.primary,
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
  },

  textoContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },

  inputContainer: {
    backgroundColor: COLORS.inputBg,
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 8,
    height: 52,
    width: '92%',
    borderRadius: 12,
    paddingHorizontal: 12,
  },

  input: {
    backgroundColor: 'transparent',
    flex: 1,
    height: 52,
    borderRadius: 12,
    fontSize: 16,
    color: '#04334a',
    paddingHorizontal: 8,
  },

  icone: {
    height: 22,
    width: 22,
    marginLeft: 6,
  },

  iconeEmail: {
    height: 20,
    width: 20,
    marginRight: 10,
    marginLeft: 6,
  },

  card: {
    width: '92%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 18,
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },

  forgotText: {
    alignSelf: 'flex-end',
    marginRight: 22,
    color: COLORS.primary,
    fontWeight: '600',
  },

  bottomText: {
    color: COLORS.muted,
  },
});

export default estilos;
