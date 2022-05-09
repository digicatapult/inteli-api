
describe('recipe controller', () => {
  describe('transactions /create', () => {
    describe('if req.params.id is not provided', () => {
      it('throws validation error', () => {

      })

      it('does not perform any database calls and does not create transaction', () => {

      })

      it('returns next along with the error so middleware can handle the error', () => {

      })
    })

    describe('if recipe does not exists in local db', () => {
      it('returns 404 alog with not found message', () => {

      })
      it('does not create a transaction', () => {

      })
    })
    // --- happy path ---
    it('validates req params', () => {})
    it('checks if recipe is in local db', () => {})
    it('calls runProcess method', () => {})
    it('inserts new transaction to local db', () => {})
    it('returns 200 along with the transaction id', () => {

    })
  })
})