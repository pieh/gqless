import { print } from 'graphql/language/printer'
import {
  Query,
  QueryResponse,
  Middleware,
  MiddlewareMethod,
} from 'graphql-builder'

const format = (...parts: any[][]) => {
  const texts = []
  const styles = []
  for (const [text, style] of parts) {
    texts.push(text)
    styles.push(`font-weight: normal; ${style}`)
  }

  return [`%c${texts.join('%c')}`, ...styles]
}

export class LoggerMiddleware implements Middleware {
  constructor(protected query: Query<any>) {}

  private get header() {
    return [
      ['GraphQL ', 'color: gray; font-weight: lighter'],
      ['query ', 'color: #03A9F4; font-weight: bold'],
      [
        `${this.query.name || '(Unnamed)'} `,
        'font-weight: bold; color: inherit',
      ],
    ].filter(Boolean)
  }

  public onFetch = (async (query, responsePromise, selections) => {
    const start = Date.now()

    let response: QueryResponse | undefined = undefined
    let error: any = undefined
    try {
      response = await responsePromise
    } catch (e) {
      error = e
    }

    const time = Date.now() - start

    console.groupCollapsed(
      // @ts-ignore
      ...format(
        ...this.header,
        [`(${time}ms)`, 'color: gray'],
        [` ${selections.length} selections`, 'color: gray']
      )
    )

    const headerStyles = `font-weight: bold; color: #f316c1`

    console.groupCollapsed(
      // @ts-ignore
      ...format(['Selections', headerStyles])
    )
    for (const selection of selections) {
      // @ts-ignore
      console.groupCollapsed(...format([selection.path.toString(), '']))
      console.log(selection)
      console.groupEnd()
    }
    console.groupEnd()

    // console.log(...format(['SELECTIONS', 'color: orange']), selectionsObj)
    console.group(
      ...format(
        ['Query ', headerStyles],
        ['  ', `background-image: url(https://graphql.org/img/logo.svg)`]
      )
    )
    console.log(...format([print(query), 'color: gray']))
    console.groupEnd()

    if (error) {
    } else {
      console.log(...format(['Result', headerStyles]), response)
    }
    console.groupEnd()
  }) as MiddlewareMethod<'onFetch'>
}