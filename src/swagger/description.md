<details><summary>API Response form</summary><p>

```
Success = http status code 200 번대
{
	data: {}, // any type
    error: null
}

Error = http status code 200 이외
{
    data: null
    error: {
        message: "",
        code: "" // ErrorCode 참고. null 또는 "" 일 수 있음
    }
}
```

 </p></details>

<details><summary>ErrorCodeEnum</summary><p>

```
{
	SIGNUP_DUP_EMAIL = 'AUTH001',
}
```

 </p></details>
