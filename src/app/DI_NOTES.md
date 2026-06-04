# Comprehensive Guide to Angular Dependency Injection (DI)

This guide summarizes the internal mechanics of Angular's Dependency Injection system, explaining how providers work under the hood, how to create custom tokens, and how to inject them.

---

## What is Happening Behind the Scenes?

When you register a service using a shorthand syntax (like adding a class directly to the `providers` array), Angular automatically translates it into a complete **Provider Object**. 

A standard provider object explicitly maps a unique identifier to its implementation:

```typescript
{ provide: TasksService, useClass: TasksService }
```

### The Component Parts: `provide` vs. `useClass`
*   **`provide` (The What / The Identifier)**: Registers the **Injection Token**. It acts as a unique lookup key or address that components use to request a specific dependency. By default, the class name itself serves as the token.
*   **`useClass` (The How / The Implementation)**: Tells Angular which class to instantiate when someone requests the corresponding token. Other configuration properties exist for different use cases, such as `useValue`, `useFactory`, or `useExisting`.

---

## Custom Injection Tokens

While class names work perfectly as default tokens, you can explicitly create custom identifiers using Angular’s `InjectionToken` class.

### 1. Why use them?
*   To inject non-service values (like configuration objects, environment strings, or API endpoints) that lack a class representation.
*   For advanced architectural use cases where you need to fully decouple a token from a strict class implementation.

### 2. How to create and type them?
Because custom tokens do not inherently carry TypeScript type definitions, you must pass a generic type argument so consuming components know what type of data they will receive.

```typescript
import { InjectionToken } from '@angular/core';
import { TasksService } from './tasks.service';

// Creating a typed token for a class instance
export const TasksServiceToken = new InjectionToken<TasksService>('tasks-service-token');
```

### 3. How to register them?
You link your custom token to the target class inside your provider configurations:

```typescript
providers: [
  { provide: TasksServiceToken, useClass: TasksService }
]
```

---

## How to Inject a Custom Token

Once you deviate from the default class name token, you must explicitly tell Angular to look for your custom token when retrieving the dependency.

### Method A: Using the modern `inject()` function
The `inject()` function natively accepts custom tokens. Because the token was created with generic type information (`new InjectionToken<TasksService>`), TypeScript automatically infers the correct return type.

```typescript
private tasksService = inject(TasksServiceToken);
```

### Method B: Using constructor injection
You cannot use a custom token directly as a TypeScript type definition inside a constructor signature. Instead, you must use the **`@Inject()` decorator** (uppercase 'I') directly before the parameter to point Angular to the token.

```typescript
import { Inject } from '@angular/core';

constructor(@Inject(TasksServiceToken) private tasksService: TasksService) {}
```

---

## When to use each approach?

*   **Shorthand Approach**: Use it 95% of the time for standard services because it minimizes boilerplate code.
*   **Custom Token Approach**: Use it specifically when injecting third-party configurations, plain objects, primitive values, or when building highly decoupled architectural interfaces.
