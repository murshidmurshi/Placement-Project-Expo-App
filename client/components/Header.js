import React from 'react';
import { TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Button, Block, NavBar, Text, theme } from 'galio-framework';
import { useNavigation } from '@react-navigation/native';
import Ionicon from 'react-native-vector-icons/Ionicons';


import Icon from './Icon';
import Input from './Input';
import Tabs from './Tabs';
import argonTheme from '../constants/Theme';

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);
const handleNotfication=(navigation)=>{
  console.log("Helllo",'handleNotfication');
  navigation.navigate('Notification');
}
const BellButton = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]}  onPress={()=>handleNotfication(navigation)} >
    <Icon
      family="ArgonExtra"
      size={16}
      name="bell"
      color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
    <Block middle style={styles.notify} />
  </TouchableOpacity>
);
const AddHod = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]}   onPress={() => navigation.navigate('AddHod')}>
    <Ionicon
      size={21}
      name="add-circle"
      color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);
const AddStudent = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]}  onPress={() => navigation.navigate('AddStudent')}>
    <Ionicon
      size={21}
      name="add-circle"
      color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);
const AddCompany = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]}  onPress={() => navigation.navigate('AddCompany')}>
    <Ionicon
      size={21}
      name="add-circle"
      color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);
const AddJob = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]}  onPress={() => navigation.navigate('AddJob')}>
    <Ionicon
      size={21}
      name="add-circle"
      color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);

const BasketButton = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]}>
    <Icon
      family="ArgonExtra"
      size={16}
      name="basket"
      color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);

const SearchButton = ({isWhite, style, navigation}) => {
  const { navigate } = useNavigation();
  return (
    <TouchableOpacity style={[styles.button, style]} >
      <Icon
        size={16}
        family="Galio"
        name="search-zoom-in"
        color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
      />
    </TouchableOpacity>
  );
};

const Header = ({ back, title, white, transparent, bgColor, iconColor, titleColor, optionLeft, optionRight, tabs, tabIndex,isIcon }) => {
  const navigation = useNavigation();

  const handleLeftPress = () => {
    return (back ? navigation.goBack() : navigation.openDrawer());
  };

  const renderRight = () => {
    if (title === 'Title') {
      return [
        <BellButton key='chat-title' navigation={navigation} isWhite={white} />,
        <BasketButton key='basket-title' navigation={navigation} isWhite={white} />
      ];
    }
    console.log(isIcon,'isIcon');
    switch (title) {
      case 'Home':
        return ([
          !isIcon && <BellButton key='chat-home' navigation={navigation} isWhite={white} />,
          // <BasketButton key='basket-home' navigation={navigation} isWhite={white} />
        ]);
      case 'Hod':
        return ([
          !isIcon && <AddHod key='basket-categories' navigation={navigation} isWhite={white} />,
          // !isIcon && <BellButton key='chat-categories' navigation={navigation} isWhite={white} />
        ]);
      case 'Student':
        return ([
          !isIcon && <AddStudent key='basket-deals' navigation={navigation} isWhite={white} />,
          // !isIcon && <BellButton key='chat-deals' navigation={navigation} isWhite={white} />
        ]);
        
        // case 'Company':
        //   return ([
        //     !isIcon && <AddCompany key='basket-deals' navigation={navigation} isWhite={white} />,
        //   ]);
        case 'Job':
          return ([
        <AddJob key='basket-deals' navigation={navigation} isWhite={white} />,
          ]);
      default:
        break;
    }
    
  };

  const renderSearch = () => {
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        placeholderTextColor={'#8898AA'}
        // onFocus={() => navigation.navigate('Pro')}
        iconContent={<Icon size={16} color={theme.COLORS.MUTED} name="search-zoom-in" family="ArgonExtra" />}
      />
    );
  };

  const renderOptions = () => {
    return (
      <Block row style={styles.options}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon name="diamond" family="ArgonExtra" style={{ paddingRight: 8 }} color={argonTheme.COLORS.ICON} />
            <Text size={16} style={styles.tabTitle}>{optionLeft || 'Beauty'}</Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon size={16} name="bag-17" family="ArgonExtra" style={{ paddingRight: 8 }} color={argonTheme.COLORS.ICON}/>
            <Text size={16} style={styles.tabTitle}>{optionRight || 'Fashion'}</Text>
          </Block>
        </Button>
      </Block>
    );
  };

  const renderTabs = () => {
    const defaultTab = tabs && tabs[0] && tabs[0].id;
    
    if (!tabs) return null;

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={id => navigation.setParams({ tabId: id })} />
    );
  };

  const renderHeader = () => {
    if (tabs || renderSearch ) {
      return (
        <Block center>
          {/* {renderSearch ? renderSearch() : null} */}
          {/* {renderOptions ? renderOptions() : null} */}
          {/* {tabs ? renderTabs() : null} */}
        </Block>
      );
    }
  };

  const noShadow = ['Search', 'Categories', 'Deals', 'Pro', 'Profile'].includes(title);
  const headerStyles = [
    !noShadow ? styles.shadow : null,
    transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
  ];

  const navbarStyles = [
    styles.navbar,
    bgColor && { backgroundColor: bgColor }
  ];

  return (
    <Block style={headerStyles}>
      <NavBar
        back={false}
        title={title=="Home"?"":title}
        style={navbarStyles}
        transparent={transparent}
        right={renderRight()}
        rightStyle={{ alignItems: 'center' }}
        left={
          <Icon 
            name={back ? 'chevron-left' : "menu"} family="entypo" 
            size={20} onPress={handleLeftPress} 
            color={iconColor || (white ? argonTheme.COLORS.WHITE : argonTheme.COLORS.ICON)}
            style={{ marginTop: 2 }}
          />
        }
        leftStyle={{ paddingVertical: 12, flex: 0.2 }}
        titleStyle={[
          styles.title,
          { color: argonTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
          titleColor && { color: titleColor }
        ]}
      />
      {renderHeader()}
    </Block>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative',
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    // elevation: 1,
  },
  notify: {
    backgroundColor: argonTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 9,
    right: 12,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: argonTheme.COLORS.BORDER
  },
  options: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '400',
    color: argonTheme.COLORS.HEADER
  },
});

export default Header;
