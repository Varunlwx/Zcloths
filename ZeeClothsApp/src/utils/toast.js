import Toast from 'react-native-toast-message';

export const showToast = (message, type = 'info') => {
  Toast.show({
    type,
    text1: message,
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 100,
    props: {
      style: {
        backgroundColor: getToastColor(type),
        borderLeftWidth: 4,
        borderLeftColor: getToastBorderColor(type),
      },
      text1Style: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#ffffff',
      },
    },
  });
};

const getToastColor = (type) => {
  switch (type) {
    case 'success':
      return 'rgba(16, 185, 129, 0.9)';
    case 'error':
      return 'rgba(239, 68, 68, 0.9)';
    case 'warning':
      return 'rgba(245, 158, 11, 0.9)';
    default:
      return 'rgba(59, 130, 246, 0.9)';
  }
};

const getToastBorderColor = (type) => {
  switch (type) {
    case 'success':
      return '#059669';
    case 'error':
      return '#dc2626';
    case 'warning':
      return '#d97706';
    default:
      return '#1d4ed8';
  }
};