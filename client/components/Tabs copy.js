import React, { useRef, useState } from 'react';
import { StyleSheet, Dimensions, FlatList, Animated } from 'react-native';
import { Block, theme } from 'galio-framework';

const { width } = Dimensions.get('screen');
import argonTheme from '../constants/Theme';

const defaultMenu = [
  { id: 'popular', title: 'Popular', },
  { id: 'beauty', title: 'Beauty', },
  { id: 'cars', title: 'Cars', },
  { id: 'motocycles', title: 'Motocycles', },
];

const Tabs = ({ data = defaultMenu, initialIndex = null, onChange }) => {
  const [active, setActive] = useState(null);
  const animatedValue = useRef(new Animated.Value(1)).current;
  const menuRef = useRef();

  const animate = () => {
    animatedValue.setValue(0);

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 220,
      useNativeDriver: false, // color not supported
    }).start()
  }

  const onScrollToIndexFailed = () => {
    menuRef.current.scrollToIndex({
      index: 0,
      viewPosition: 0.5
    });
  }

  const selectMenu = (id) => {
    setActive(id);

    menuRef.current.scrollToIndex({
      index: data.findIndex(item => item.id === id),
      viewPosition: 0.5
    });

    animate();
    onChange && onChange(id);
  }

  const renderItem = ({ item }) => {
    const isActive = active === item.id;

    const textColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [argonTheme.COLORS.BLACK, isActive ? argonTheme.COLORS.WHITE : argonTheme.COLORS.BLACK],
      extrapolate: 'clamp',
    });

    const containerStyles = [
      styles.titleContainer,
      !isActive && { backgroundColor: argonTheme.COLORS.SECONDARY },
      isActive && styles.containerShadow
    ];

    return (
      <Block style={containerStyles}>
        <Animated.Text
          style={[
            styles.menuTitle,
            { color: textColor }
          ]}
          onPress={() => selectMenu(item.id)}>
          {item.title}
        </Animated.Text>
      </Block>
    )
  }

  return (
    <Block style={styles.container}>
      <FlatList
        data={data}
        horizontal={true}
        ref={menuRef}
        extraData={active}
        keyExtractor={(item) => item.id}
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
    backgroundColor: argonTheme.COLORS.ACTIVE,
    borderRadius: 4,
    marginRight: 9
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: argonTheme.COLORS.MUTED
  },
});

export default Tabs;
