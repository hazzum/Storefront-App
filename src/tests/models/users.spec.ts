import { User, UserStore } from '../../models/users'
const store: UserStore = new UserStore()

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

const cred1 = {
  user_name: 'lauran',
  password: 'password_@@'
}

const cred2 = {
  user_name: 'jimmy',
  password: 'password_f123'
}

describe('Test user model', () => {
  describe('Function definitions', () => {
    it('should have an show all method', () => {
      expect(store.index).toBeDefined()
    })

    it('should have a sing up method', () => {
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
    it('sign up a new user 1', async () => {
      await expectAsync(store.Sign_up(user1)).toBeResolved()
    })

    it('sign up a new user 2', async () => {
      await expectAsync(store.Sign_up(user2)).toBeResolved()
    })

    it('authenticate user 1', async () => {
      await expectAsync(store.Authenticate(cred1.user_name, cred1.password)).toBeResolved()
    })

    it('authenticate user 2', async () => {
      await expectAsync(store.Authenticate(cred2.user_name, cred2.password)).toBeResolved()
    })
  })

  describe('User Table CRUD Operations', () => {
    it('index method should return a list of users', async () => {
      const result = await store.index()
      expect(result).toBeInstanceOf(Array<User>)
    })

    it('show one method should return the correct user', async () => {
      const result = await store.getByID('2')
      expect(result.user_name).toEqual(user1.user_name)
    })

    it('show one method should return the correct user', async () => {
      const result = await store.getByID('3')
      expect(result.user_name).toEqual(user2.user_name)
    })

    it('update method should update user info', async () => {
      const newUser = {
        id: '3',
        first_name: 'Chuck',
        last_name: user2.last_name,
        user_name: user2.user_name
      }
      const result = await store.update(newUser)
      expect(result.first_name).toEqual(newUser.first_name)
    })

    it('delete method should remove the user', async () => {
      await store.destroy('2')
      const result = await store.getByID('2')
      expect(result).toEqual(undefined as unknown as User)
    })
  })
})
