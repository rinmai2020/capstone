let baseUrl = "https://62a42428259aba8e10e2f93f.mockapi.io/api/capstone";

function getProductsAPI() {
  return axios({
    url: baseUrl,
    method: "GET",
  });
}
