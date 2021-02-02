import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import DashBoard from '../screens/User/DashBoard';
import AddPersonelScreen from '../screens/User/AddPersonelScreen';
import MyPersonelScreen from '../screens/User/MyPersonelScreen';
import WorkDetailScreen from '../screens/User/WorkDetailScreen';
import MyWorkListScreen from '../screens/User/MyWorkListScreen';
import EditWorkScreen from '../screens/User/EditWorkScreen';
import AddWorkScreen from '../screens/User/AddWorkScreen';
import PersonelDetailScreen from '../screens/User/PersonelDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import MyInfoScreen from '../screens/User/MyInfoScreen';
import EditMyInfoScreen from '../screens/User/EditMyInfoScreen';
import EditPersonelScreen from '../screens/User/EditPersonelScreen';
import MyFriendsListScreen from '../screens/User/MyFriendsListScreen';
import SendRequestScreen from '../screens/User/SendRequestScreen';
import MyFriendDetailScreen from '../screens/User/MyFriendDetailScreen';
import NonPairedFriendDetailScreen from '../screens/User/NonPairedFriendDetailScreen';
import MyFriendsRequestsScreen from '../screens/User/MyFriendsRequestsScreen';
import Signup from '../screens/User/Signup';
import { LinearGradient } from 'expo-linear-gradient';


const defaultNavOptions = {
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: 'white',
  headerTitleAlign: 'center',
  headerBackground: () =>
    <LinearGradient
      colors={['#900C3F', '#900C3F']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  ,
};


const UserNavigator = createStackNavigator({
  Dashboard: DashBoard,
  MyFriendsRequests: MyFriendsRequestsScreen,
  AddPersonel: AddPersonelScreen,
  MyPersonel: MyPersonelScreen,
  PersonelDetail: PersonelDetailScreen,
  WorkDetail: WorkDetailScreen,
  EditWork: EditWorkScreen,
  MyWorkList: MyWorkListScreen,
  AddWork: AddWorkScreen,
  EditPersonel: EditPersonelScreen,
  Myinfo: MyInfoScreen,
  EditMyInfo: EditMyInfoScreen,
  MyFriendsList: MyFriendsListScreen,
  SendRequest: SendRequestScreen,
  MyFriendDetail: MyFriendDetailScreen,
  NonPairedFriendDetail: NonPairedFriendDetailScreen,
}, { defaultNavigationOptions: defaultNavOptions });




const AuthNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  UserSignup: {
    screen: Signup,
    navigationOptions: {
      headerTransparent: true
    }
  }
});




const MainNavigator = createSwitchNavigator({
  Auth: AuthNavigator,
  User: UserNavigator,
});


export default createAppContainer(MainNavigator);


