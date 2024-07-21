# Next + sqlite + fly.io

## 셋업

```
fly auth signup
fly apps create next-sqlite-fly
fly volumes create data --size 1 --app next-sqlite-fly
```

## 배포

```
fly deploy
```

## 주의사항

- sqlite 사용하기 때문에 빌드타임에 최신 db 데이터를 가져오지 못함
  - 즉, next 에서 db를 이용한 static generation을 하는 경우 애매
  - 일단 db 사용하는 곳은 force-dynamic 설정
