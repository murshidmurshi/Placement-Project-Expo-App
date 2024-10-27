import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Dimensions, FlatList, Animated } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

const { width } = Dimensions.get('screen');
import argonTheme from '../constants/Theme';

// const defaultMenu = [
//   { id: 'popular', title: 'Popular', },
//   { id: 'beauty', title: 'Beauty', },
//   { id: 'cars', title: 'Cars', },
//   { id: 'motocycles', title: 'Motocycles', },
// ];

const Tabs = ({ data, initialIndex = 0, onChange,setSelectedDepartment }) => {
  const [active, setActive] = useState(null);
  const animatedValue = useRef(new Animated.Value(1)).current;
  const menuRef = useRef();
  useEffect(() => {
    if (initialIndex >= 0 && initialIndex < data?.length) {
      setActive(1);
    } else {
      setActive(1); // Select the first item if initialIndex is not valid
    }
  }, [initialIndex]);
  

  const animate = () => {
    animatedValue.setValue(0);

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 220,
      useNativeDriver: false,
    }).start()
  }

  const onScrollToIndexFailed = () => {
    menuRef.current.scrollToIndex({
      index: 0,
      viewPosition: 0.5
    });
  }
  const selectMenu = (id,departmentName) => {
    setSelectedDepartment(departmentName)
    setActive(id);
    menuRef.current.scrollToIndex({
      index: data?.findIndex(item => item?.name === departmentName),
      viewPosition: 0.5
    });

    animate();
    onChange && onChange(id);
  }

  const renderItem = ({ item, index }) => {
    const isActive = active === index + 1;

    const textColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [argonTheme.COLORS.BLACK, isActive ? argonTheme.COLORS.BLACK : argonTheme.COLORS.BLACK],
      extrapolate: 'clamp',
    });

    const containerStyles = [
      styles.titleContainer,
      !isActive && { backgroundColor: argonTheme.COLORS.SECONDARY,borderColor:'white' },
      isActive && styles.containerShadow
    ];

    return (
      <Block style={containerStyles}>
        <Animated.Text
          style={[
            styles.menuTitle,
            { color: textColor }
          ]}
          onPress={() => selectMenu(index + 1,item?.name)}>
          {item?.name}
        </Animated.Text>
      </Block>
    )
  }

  return (
    <Block style={styles.container}>
      {data?.length==0 &&(
        <Text style={{fontSize:14,paddingLeft:10,marginTop:10,fontFamily:'PoppinsMedium'}}>No Department Availabel</Text>
      )}
      <FlatList
        data={data}
        horizontal={true}
        ref={menuRef}
        extraData={active}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={onScrollToIndexFailed}
        renderItem={renderItem}
        contentContainerStyle={styles.menu}
      />
    </Block>
  )
}

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: theme.COLORS.WHITE,
    zIndex: 2,
  },
  menu: {
    paddingHorizontal: theme.SIZES.BASE * 2.5,
    paddingTop: 8,
    paddingBottom: 16,
  },
  titleContainer: {
    alignItems: 'center',
    borderColor: argonTheme.COLORS.PRIMARY,
    backgroundColor:'white',
    borderRadius: 4,
    marginRight: 9,
    borderWidth:1
  },
  containerShadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  menuTitle: {
    fontWeight: '600',
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: argonTheme.COLORS.MUTED,
    fontFamily:'PoppinsMedium',
  },
});

export default Tabs;
