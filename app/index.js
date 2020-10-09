import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, KeyboardAvoidingView, Platform, CheckBox } from 'react-native';
import Svg, { Image, Circle, ClipPath } from 'react-native-svg';
import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');

const {
    Value,
    event,
    block,
    cond,
    eq,
    set,
    Clock,
    startClock,
    stopClock,
    debug,
    timing,
    clockRunning,
    interpolate,
    Extrapolate,
    concat
} = Animated;

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    };

    const config = {
        duration: 1000,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease)
    };

    return block([
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock)
        ]),
        timing(clock, state, config),
        cond(state.finished, debug('stop clock', stopClock(clock))),
        state.position
    ]);
}
class MusicApp extends Component {
    constructor() {
        super();
        this.buttonOpacity = new Value(1);
        this.onStateChange = event([
            {
                nativeEvent: ({ state }) =>
                    block([
                        cond(
                            eq(state, State.END),
                            set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
                        )
                    ])
            }
        ]);

        this.onCloseState = event([
            {
                nativeEvent: ({ state }) =>
                    block([
                        cond(
                            eq(state, State.END),
                            set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
                        )
                    ])
            }
        ]);

        this.buttonY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [100, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.bgY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [-height / 3 - 50, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.textInputZindex = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, -1],
            extrapolate: Extrapolate.CLAMP
        });

        this.textInputY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [0, 100],
            extrapolate: Extrapolate.CLAMP
        });

        this.textInputOpacity = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.rotateCross = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [180, 360],
            extrapolate: Extrapolate.CLAMP
        });

        this.state = {
            isSelected: false,
        };
    }

    rememberPassword = () => {           
        console.log('------rememberPassword');   
    }

    savePassword = () => {           
        console.log('------savePassword');   
        this.setState({isSelected: !this.state.isSelected});
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{ flex: 1, }} >
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'flex-end' }} >
                <Animated.View
                    style={{
                        ...StyleSheet.absoluteFill,
                        transform: [{ translateY: this.bgY }]
                    }}
                >
                    <Svg height={height + 50} width={width}>
                        <ClipPath id="clip">
                            <Circle r={height + 50} cx={width / 2} />
                        </ClipPath>
                        <Image
                            href={require('../assets/lua4.png')}
                            width={width}
                            height={height + 50}
                            preserveAspectRatio="xMidYMid slice"
                            clipPath="url(#clip)"
                        />
                    </Svg>
                </Animated.View>
                <View style={{ height: height / 3, justifyContent: 'center' }}>
                    <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                        <Animated.View
                            style={{
                                ...styles.button,
                                opacity: this.buttonOpacity,
                                transform: [{ translateY: this.buttonY }]
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>LOGAR</Text>
                        </Animated.View>
                    </TapGestureHandler>
                    <Animated.View
                        style={{
                            zIndex: this.textInputZindex,
                            opacity: this.textInputOpacity,
                            transform: [{ translateY: this.textInputY }],
                            height: height / 3,
                            ...StyleSheet.absoluteFill,
                            top: null,
                            justifyContent: 'center'
                        }} >
                        <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                            <Animated.View style={styles.closeButton}>
                                <Animated.Text style={{ fontSize: 15, transform: [{ rotate: concat(this.rotateCross, 'deg') }] }}>
                                    X
                                </Animated.Text>
                            </Animated.View>
                        </TapGestureHandler>
                        <TextInput placeholder="E-MAIL" style={styles.textInput} placeholderTextColor="black" />
                        <TextInput placeholder="SENHA" style={styles.textInput} placeholderTextColor="black" />
                        <Animated.View style={styles.button} >
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                LOGIN
                            </Text>
                        </Animated.View>
                        <View style={{ flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'flex-end', marginBottom: 0, width: width }}>
                            <View style={{ flex: 0.3, alignItems: 'flex-start', backgroundColor: 'transparent',}}>
                                <TapGestureHandler onHandlerStateChange={this.esqueciSenhaClick}>
                                    <Animated.View style={styles.buttonRodape} >
                                        <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
                                            REGISTER
                                        </Text>
                                    </Animated.View>
                                </TapGestureHandler>
                            </View>
                            <View style={{ flex: 0.4, alignItems: 'center', backgroundColor: 'transparent',}}>                                
                                    <Animated.View style={styles.checkBoxRodape} >
                                        <CheckBox
                                            value={this.state.isSelected}
                                            onValueChange={this.savePassword}
                                            style={{alignSelf: "center",}}
                                            tintColors={ true? 'white': 'white' }
                                        />
                                        <Text style={{ fontSize: 11, fontWeight: 'bold', }}>
                                            SAVE PASSWORD
                                        </Text>
                                    </Animated.View>                                
                            </View>
                            <View style={{ flex: 0.3, alignItems: 'flex-end', backgroundColor: 'transparent',}}>
                                <TapGestureHandler onHandlerStateChange={this.rememberPassword}>
                                    <Animated.View style={styles.buttonRodape} >
                                        <Text style={{ fontSize: 11, fontWeight: 'bold' }}>                                            
                                            RECOVER PASSWORD                                            
                                        </Text>
                                    </Animated.View>
                                </TapGestureHandler>
                            </View>
                        </View>                        
                    </Animated.View>                    
                </View>
            </View>
            </KeyboardAvoidingView>    
        );
    }
}
export default MusicApp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: 'white',
        height: 40,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    buttonRodape: {        
        backgroundColor: 'white',
        height: 20,
        width: 110,
        marginHorizontal: 2,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',        
        marginTop: 15,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
    },

    checkBoxRodape: {        
        backgroundColor: 'white',        
        height: 20,
        width: 120,
        marginHorizontal: 2,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',        
        marginTop: 15,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        flexDirection: 'row',
    },

    closeButton: {
        height: 40,
        width: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -20,
        left: width / 2 - 20,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
    },
    textInput: {
        height: 40,
        borderRadius: 25,
        borderWidth: 1,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: 'white',
    },

});
