const assert = require("chai").assert;

const database = (() => {
  const _database = {
    621: { id: 621, name: "XxDragonSlayerxX", friends: [123, 251, 631] },
    123: { id: 123, name: "FriendNo1", friends: [621, 631] },
    251: { id: 251, name: "SecondBestFriend", friends: [621] },
    631: { id: 631, name: "ThirdWh33l", friends: [621, 123, 251] },
  };

  const getUser = (id) =>
    new Promise((res, rej) => {
      setTimeout(() => {
        _database[id] ? res(_database[id]) : rej(new Error("not_found"));
      }, 300);
    });

  const listUserIDs = () => Promise.resolve([621, 123, 251, 631]);

  return { getUser, listUserIDs };
})();

const expected = [
  {
    id: 621,
    name: "XxDragonSlayerxX",
    friends: [
      { id: 123, name: "FriendNo1", friends: [621, 631] },
      { id: 251, name: "SecondBestFriend", friends: [621] },
      { id: 631, name: "ThirdWh33l", friends: [621, 123, 251] },
    ],
  },
  {
    id: 123, // should be 123 as FriendNo1's id is 123
    name: "FriendNo1",
    friends: [
      { id: 621, name: "XxDragonSlayerxX", friends: [123, 251, 631] },
      { id: 631, name: "ThirdWh33l", friends: [621, 123, 251] },
    ],
  },
  {
    id: 251,
    name: "SecondBestFriend",
    friends: [{ id: 621, name: "XxDragonSlayerxX", friends: [123, 251, 631] }],
  },
  {
    id: 631,
    name: "ThirdWh33l",
    friends: [
      { id: 621, name: "XxDragonSlayerxX", friends: [123, 251, 631] },
      { id: 123, name: "FriendNo1", friends: [621, 631] },
      { id: 251, name: "SecondBestFriend", friends: [621] },
    ],
  },
];

const validate = (result) => {
  try {
    assert.deepEqual(result, expected);
    console.info("Test2 Passed");
  } catch (e) {
    console.error("Failed", e);
  }
};

// implement a method to create this result
const userInfo = [];

/**
 * @description fetch user data by userId
 * @param userId
 * @returns {Promise<unknown>}
 */
const fetchUserDetails = async (userId) => {
  // if user already fetched and stored, return from cached data to reduce DB calls
  if (userInfo[userId]) {
    return userInfo[userId];
  }
  const user = await database.getUser(userId);
  userInfo[userId] = user;
  return user;
}

/**
 * @description fetch user details of multiple user by user Id
 * @param userIdList
 * @returns {Promise<[]>}
 */
const fetchUserDetailsList = async (userIdList) => {
  const users = [];
  await Promise.all(userIdList.map(async (userId) => {
    const user = await fetchUserDetails(userId);
    users.push(user);
  }));
  return users
}

/**
 * @description populate user details with user friends data
 * @returns {Promise<[]>}
 */
const populateUserFriendsData = async () => {
  const userFriendsData = [];
  const userIdList = await database.listUserIDs();

  for (const userId of userIdList) {
    const user = await fetchUserDetails(userId);
    const { name, id, friends } = user;
    const friendsData = await fetchUserDetailsList(friends);
    userFriendsData.push({ id, name, friends: friendsData });
  }
  return userFriendsData;
}


// At the end call validate
populateUserFriendsData().then(result => validate(result));

