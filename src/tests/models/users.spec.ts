import { User, UserStore } from '../../models/users'
import bcrypt from 'bcrypt'
const store: UserStore = new UserStore()

describe('Test user model', () => {
  let userID: string | undefined
  let userID2: string | undefined
  const user1: User = {
    first_name: 'Lauran',
    last_name: 'Wexler',
    user_name: 'lauran',
    password: 'password_@@'
  }

  const user2: User = {
    first_name: 'Jimmy',
    last_name: 'McGill',
    user_name: 'jimmy',
    password: 'password_f123'
  }

  beforeAll(async () => {
    const { id } = await store.Sign_up(user1)
    userID = id
  })
  describe('Function definitions', () => {
    it('should have an show all method', () => {
      expect(store.index).toBeDefined()
    })

    it('should have a sign up method', () => {
      expect(store.Sign_up).toBeDefined()
    })

    it('should have an authenticate method', () => {
      expect(store.Authenticate).toBeDefined()
    })

    it('should have a show one method', () => {
      expect(store.getByID).toBeDefined()
    })

    it('should have an update method', () => {
      expect(store.update).toBeDefined()
    })

    it('should have a delete method', () => {
      expect(store.destroy).toBeDefined()
    })
  })

  describe('Sign up and authenticate', () => {
    it('sign up a new user ', async () => {
      const result = await store.Sign_up(user2)
      userID2 = result.id
      expect(result.user_name).toEqual(user2.user_name)
    })

    it('authenticate user 1', async () => {
      const result = store.Authenticate(user1.user_name, user1.password as string)
      expect(result).not.toBeNull()
    })

    it('authenticate user 2', async () => {
      const result = store.Authenticate(user2.user_name, user2.password as string)
      expect(result).not.toBeNull()
    })
  })

  describe('Testing that the database saves hashed passwords', () => {
    it('by authenticate method', async () => {
      let pass
      const result = await store.Authenticate(user2.user_name, user2.password as string)
      if (result != null) {
        pass = result.password_digest
      }
      expect(
        bcrypt.compareSync(
          ((user2.password as string) + process.env.BCRYPT_PASSWORD) as unknown as string,
          pass as string
        )
      ).toBeTruthy()
    })
    it('by get method', async () => {
      let pass
      const result = await store.getByID(userID2 as string)
      if (result != null) {
        pass = result.password_digest
      }
      expect(
        bcrypt.compareSync(
          ((user2.password as string) + process.env.BCRYPT_PASSWORD) as unknown as string,
          pass as string
        )
      ).toBeTruthy()
    })
  })

  describe('User Table CRUD Operations', () => {
    it('index method should return a list of users', async () => {
      const result = await store.index()
      expect(result).toBeInstanceOf(Array<User>)
    })

    it('show one method should return the correct user', async () => {
      const result = await store.getByID(userID as string)
      expect(result.user_name).toEqual(user1.user_name)
    })

    it('show one method should return the correct user', async () => {
      const result = await store.getByID(userID2 as string)
      expect(result.user_name).toEqual(user2.user_name)
    })

    it('update method should update user info', async () => {
      const newUser = {
        id: userID2,
        first_name: 'Chuck',
        last_name: user2.last_name,
        user_name: user2.user_name
      }
      const result = await store.update(newUser)
      expect(result.first_name).toEqual(newUser.first_name)
    })

    it('delete method should remove the user', async () => {
      await store.destroy(userID2 as string)
      const result = await store.getByID(userID2 as string)
      expect(result).toEqual(undefined as unknown as User)
    })
  })
})
