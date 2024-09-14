import { ID, Account, Client, Avatars, Databases } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.edu.sena",
    projectId: "66cb49ed003743dc59ef",
    databaseId: "66cb4d9800314353a143",
    userCollectionId: "66cb4e13002f22350ea2",  // Corrige 'userCollectionid' a 'userCollectionId'
    videoCollectionId: "66cb4e6b003c1f6fa324",
    storageId: "66cb5306002a2f0fe36b"
};

//init
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)  // Corrige 'endpoint' a 'setEndpoint'
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);  // Corrige 'setPlafom' a 'setPlatform'

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      )  

      if(!newAccount) throw Error;

      const avatarUrl = avatars.getInitials(username)

      await signIn(email, password);

      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avatarUrl
        }
      )

      return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

export async function signIn(email, password,) {
    try {
      const session = await account.createEmailPasswordSession(email, password)

      return session;
    } catch (error) {
        throw new Error(error);
        
    }
}