// a wip execution engine for a middleware based CLI framework with filesystem
// based routing for command tokens
async function execute({ steps, data }) {
  const state = {
    i: -1,
    // that data the will eventually get returned to stdout or a stream
    data: undefined,

    // modify the data and continue to the next step if there is one, otherwise
    // return the data.
    result: async (data) => {
      state.data = data
      const nextHandler = steps[state.i + 1]
      if (nextHandler) {
        state.i++
        return await nextHandler(Object.freeze({ ...state }))
      }
      return data
    },

    // modify the data and continue to the next step if there is one, otherwise
    // throw an error.
    next: async (data) => {
      const nextHandler = steps[state.i + 1]
      if (!nextHandler) state.error(new Error(`No next step`))
      state.data = data
      state.i++
      return await nextHandler(Object.freeze({ ...state }))
    },

    // modify the data and return it, logging a warning if there were more steps
    end: (data) => {
      state.data = data
      if (steps[state.i + 1]) {
        state.warn('Ending prematurely, remaining steps will be skipped.')
      }
      return data
    },

    error: (error) => {
      // TODO: custom error logic
      throw error
    },

    warn: (warning) => {
      // TODO: custom error logic
      throw console.warn(warning)
    },
  }

  return state.next(data)
}

async function example() {
  const data = await execute({
    steps: [
      ({ next }) => next(),

      // an example of a token handler ending early after a timeout
      ({ result, end }) => {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => {
            reject(end(new Error('timed out')))
          }, 1000),
        )
        return Promise.race([result({ name: 'ryan' }), timeout])
      },

      ({ result, data }) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(result(data))
          }, 500)
        })
      },

      ({ data, end }) => {
        return end({ ...data, age: 34 })
      },
    ],
  })
  console.log(data)
  process.exit()
}

example()
