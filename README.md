# graphql-builder

Seamlessly access GraphQL data, and the queries will be automatically generated.

## React

```typescript
export const GithubUser = () => {
  const { data } = useQuery()
  const user = data.user({ login: 'torvalds' })

  return (
    <div>
      <h1>
        {user.login} ({user.followers.totalCount} followers)
      </h1>
      <p>{user.bio}</p>

      <h2>Following:</h2>
      {user.following.nodes.map(user => (
        <a href={user.url} key={user.id}>
          {user.login}
        </a>
      ))}
    </div>
  )
}
```

# Features

- 100% type-safe using TypeScript

## Similiar projects

- https://github.com/sw-yx/babel-blade