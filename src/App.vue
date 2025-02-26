<template>
  <router-view></router-view>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.in-container {
  align-items: center;
  display: flex;
  justify-content: center;
}

.tab-container {
  margin-left: 20px;
  width: 100%;
}

.header {
  align-items: center;
  background-color: #00B42A;
  display: flex;
  padding: 20px 5% 20px 5%;
}

.main {
  display: flex;
  padding: 20px 5% 20px 5%;
}

.empty {
  flex-grow: 1;
}

.footer {
  align-items: center;
  background-color: #fafafa;
  display: flex;
  padding: 20px 5% 20px 5%;
}

.sp {
  align-items: center;
  display: flex;
  gap: 10px;
}

.cz {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kuang {
  align-items: center;
  border: 1px solid grey;
  border-radius: 20px;
  display: flex;
  padding: 20px;
}

.dialog {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
}

.dialog-cz {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.grid {
  column-gap: 10px;
  display: grid;
  row-gap: 10px;
}

.text {
  word-break: break-all;
}

.large-text {
  font-size: 20px;
  word-break: break-all;
}

.bold-text {
  font-weight: bold;
  word-break: break-all;
}

.large-bold-text {
  font-size: 20px;
  font-weight: bold;
  word-break: break-all;
}

.title {
  font-size: 30px;
  font-weight: bold;
}

.header-title {
  color: white;
  font-size: 40px;
  font-weight: bold;
}

.footer-text {
  color: grey;
}

.image {
  width: 60px;
}

.tx {
  border-radius: 30px;
  width: 60px;
}

.logo {
  width: 20px;
}
</style>