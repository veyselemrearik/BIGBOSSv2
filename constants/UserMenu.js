import Category from '../models/category';

export default {
CATEGORIES : [
    new Category('menu1', 'Personel Ekle', 'catAddPersonel', 'AddPersonel'),
    new Category('menu2', 'Personel Listesi', 'catPersonelList', 'MyPersonel'),
    new Category('menu3', 'İş Listesi', 'catWorkList', 'MyWorkList'),
    new Category('menu4', 'İş Ekle', 'catAddWork', 'AddWork'),
    new Category('menu5', 'Arkadaş Listesi', 'catAddFriends', 'MyFriendsList'),
    new Category('menu6', 'Arkadaş İsteği', 'requests', 'MyFriendsRequests'),
]
};
