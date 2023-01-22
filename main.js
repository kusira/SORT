"use strict";

{
  const permutation = (arr, number) => {
    let ans = [];
    if (arr.length < number) {
        return alert("permutationの第２引数は第１引数の配列数より少ない数としてください。");
    }
    if (number === 1) {
        for (let i = 0; i < arr.length; i++) {
            ans[i] = [arr[i]];
        }
    } else {
        for (let i = 0; i < arr.length; i++) {
            let parts = arr.slice(0);
            parts.splice(i, 1)[0];
            let row = permutation(parts, number - 1);
            for (let j = 0; j < row.length; j++) {
                ans.push([arr[i]].concat(row[j]));
            }
        }
    }
    return ans;
  }

  const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function array_equal(a, b) {
    if (!Array.isArray(a))    return false;
    if (!Array.isArray(b))    return false;
    if (a.length != b.length) return false;
    for (var i = 0, n = a.length; i < n; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  // 想定解
  let assumed_solution = ["A", "B", "C", "D", "E"];
  assumed_solution = shuffle(assumed_solution);

  // 表示する項目
  let conditions = [];
  let items_to_display = [];

  // * 各条件
  // what_is_edge : [0, 端にいる人の名前]
  let what_is_edge = [];

  // position : [1, インデックス, その人の名前]
  let position = [];

  // positional_relationship : [2, 1人目, 1人目の名前, 2人目, 2人目の名前]
  let positional_relationship = [];

  // whats_is_next : [3, 1人目, 1人目の名前, 2人目, 2人目の名前]
  let whats_is_next = [];

  // whats_is_not_next : [4, 1人目, 1人目の名前, 2人目, 2人目の名前]
  let whats_is_not_next = [];

  // 何が端か
  what_is_edge.push([0, assumed_solution[0]]);
  what_is_edge.push([0, assumed_solution[4]]);
  
  for (let i = 1; i < 5; i++) {
    position.push([1,i,assumed_solution[i]]);
  }

  // 二つの位置関係(全20通り)
  const pairs = [[0, 1], [1, 0], [0, 2], [2, 0], [0, 3],
                  [3, 0], [0, 4], [4, 0], [1, 2], [2, 1],
                  [1, 3], [3, 1], [1, 4], [4, 1], [2, 3],
                  [3, 2], [2, 4], [4, 2], [3, 4], [4, 3]];
  
  for (let i = 0; i < 20; i++) {
    const first = pairs[i][0];
    const secound = pairs[i][1];
    positional_relationship.push([2, first, assumed_solution[first], secound, assumed_solution[secound]]);
  }
  
  // 隣り合わせ
  for (let i = 0; i < 4; i++) {
    let first = i;
    let secound = i+1;
    whats_is_next.push([3, first, assumed_solution[first], secound, assumed_solution[secound]]);
    first, secound = secound, first;
    whats_is_next.push([3, first, assumed_solution[first], secound, assumed_solution[secound]]);
  }
  
  
  // 隣り合わせではない
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if(i==j || i==j+1 || i==j-1) continue;
      let first = i;
      let secound = j;
      whats_is_not_next.push([4, first, assumed_solution[first], secound, assumed_solution[secound]]);
      first, secound = secound, first;
      whats_is_not_next.push([4, first, assumed_solution[first], secound, assumed_solution[secound]]);
    }
  }

  // * 表示する条件の作成
  let cumulative_sum = [];
  cumulative_sum.push((1/5)*(1/4));
  cumulative_sum.push(cumulative_sum[0] + (3/10)*(3/4));
  cumulative_sum.push(cumulative_sum[1] + (4/10));
  cumulative_sum.push(cumulative_sum[2] + (3/10)*(1/2));
  cumulative_sum.push(cumulative_sum[3] + (3/10)*(1/2));

  for (let i = 0; i < 5; i++) {
    const random_num = Math.random();
    let query;
    if(random_num < cumulative_sum[0]){
      query = 0;
    }else if(random_num < cumulative_sum[1]){
      query = 1;
    }else if(random_num < cumulative_sum[2]){
      query = 2;
    }else if(random_num < cumulative_sum[3]){
      query = 3;
    }else{
      query = 4;
    }
    let A
    if(query == 0){
      A = what_is_edge[Math.floor(Math.random() * what_is_edge.length)];
      items_to_display.push(`${A[1]}は端である`);
    }else if(query == 1){
      A = position[Math.floor(Math.random() * position.length)];
      if(A[1] == 0){
        //「〇〇は端である」と「一番右/左は〇〇」は同時に出力されないようにする。
        if([0,A[2]] in conditions) continue;
        items_to_display.push(`一番左は${A[2]}である。`);
      }else if(A[1] == 4){
        if([0,A[2]] in conditions) continue;
        items_to_display.push(`一番右は${A[2]}である。`);
      }else{
        items_to_display.push(`左から${A[1]+1}番目は${A[2]}である。`);
      }
    }else if(query == 2){
      // 「〇〇は××のn個左/右である」と「××は〇〇のn個右/左である」は同時に出力されないようにする。
      let B;
      let is_show = Math.floor(Math.random() * 2);
      A = [...positional_relationship[Math.floor(Math.random() * positional_relationship.length)]];
      B = [...A];
      B[3] = A[1];
      B[4] = A[2];
      B[1] = A[3];
      B[2] = A[4];
      positional_relationship.forEach((item, index) => {
        if(array_equal(item,A) || array_equal(item,A)) {
          positional_relationship.splice(index, 1);
        }
      });
      if(A[1] < A[3]){
        if(is_show){
          items_to_display.push(`${A[2]}は${A[4]}より${A[3]-A[1]}つ左にいる`);
          A.push(1);
        }else{
          items_to_display.push(`${A[2]}は${A[4]}より左にいる`);
          A.push(0);
        }
      }else{
        if(is_show){
          items_to_display.push(`${A[2]}は${A[4]}より${A[1]-A[3]}つ右にいる`);
          A.push(1);
        }else{
          items_to_display.push(`${A[2]}は${A[4]}より右にいる`);
          A.push(0);
        }
      }
    }else if(query == 3){
      A = [...whats_is_next[Math.floor(Math.random() * whats_is_next.length)]];
      items_to_display.push(`${A[2]}の隣は${A[4]}である。`);
    }else{
      A = [...whats_is_not_next[Math.floor(Math.random() * whats_is_not_next.length)]];
      items_to_display.push(`${A[2]}の隣は${A[4]}ではない。`);
    }
    conditions.push(A);
  }
  // 同じ条件を出力しないようにしたい。
  items_to_display = [...new Set(items_to_display)];
  conditions = [...new Set(conditions)];

  // * 答え合わせ
  function check_the_answer(ans) {
    let is_ok = true;
    let right_or_wrong = {};
    let position_dict = {};
    for (let i = 0; i < 5; i++) {
      position_dict[ans[i]] = i    ;
    }
    for (let i = 0; i < conditions.length; i++) {
      right_or_wrong[i] = true;
      const A = conditions[i];
      if(A[0] == 0){
        if(position_dict[A[1]] == 0 || position_dict[A[1]] ==4) continue;
      }else if(A[0] == 1){
        if(position_dict[A[2]]==A[1]) continue;
      }else if(A[0] == 2){
        if(A[5]){
          if(A[1] - A[3] == position_dict[A[2]] - position_dict[A[4]]) continue;
        }else{
          if(A[1] < A[3] && position_dict[A[2]] < position_dict[A[4]]) continue;
          if(A[1] > A[3] && position_dict[A[2]] > position_dict[A[4]]) continue;
        }
      }else if(A[0] == 3){
        let i,j;
        i = position_dict[A[2]];
        j = position_dict[A[4]];
        if(i == j+1 || i == j-1) continue;
      }else{
        let i,j;
        i = position_dict[A[2]];
        j = position_dict[A[4]];
        if(i != j+1 && i != j-1) continue;
      }
      is_ok = false;
      right_or_wrong[i] = false;
    }
    return [is_ok,right_or_wrong];
  }
  
  let answers = [];
  let result = permutation(["A","B","C","D","E"], 5);
  result.forEach(ans => {
    let is_ok = check_the_answer(ans)[0];
    if(is_ok){
      answers.push(ans);
    }
  });

  const conditionList = document.getElementById("condition-list");

  items_to_display.forEach(item => {
    let tmp = document.createElement("li");
    tmp.innerHTML = item;
    conditionList.appendChild(tmp);
  });

  const sentAnswer = document.getElementById("sent-answer");
  const judgementText = document.getElementById("judgement-text");
  const answersList = document.getElementById("answers-list");
  answers.forEach(item => {
    let tmp = document.createElement("li");
    tmp.innerHTML = item.join("");
    answersList.appendChild(tmp);
  });

  // イベントリスナー
  sentAnswer.addEventListener("click",()=>{
    let usersAnswer = document.getElementById("users-answer");
    let arr = [];
    let tmp = usersAnswer.value;
    arr = tmp.split("")
    if(arr.indexOf("A")!=-1 && arr.indexOf("B")!=-1 && arr.indexOf("C")!=-1 && arr.indexOf("D")!=-1 && arr.indexOf("E")!=-1 && arr.length==5){
      while(conditionList.lastChild){
        conditionList.removeChild(conditionList.lastChild);
      }
      const right_or_wrong_dict = check_the_answer(arr)[1];
      console.log(right_or_wrong_dict);
      items_to_display.forEach((item,i) => {
        let tmp = document.createElement("li");
        tmp.innerHTML = item;
        if(right_or_wrong_dict[i]){
          tmp.style = "color:blue;";
        }else{
          tmp.style = "color:red;";
        }
        conditionList.appendChild(tmp);
      });
      if(check_the_answer(arr)[0]){
        judgementText.innerHTML = "正解";
        judgementText.style = "color:blue;";
      }else{
        judgementText.innerHTML = "不正解";
        judgementText.style = "color:red;";
      }
      answersList.classList.add("active");
    }
  });
}