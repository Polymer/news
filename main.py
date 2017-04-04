import webapp2
import re

class MainPage(webapp2.RequestHandler):
  def get(self, **kwargs):
    self.response.out.write(open('index.html').read())

class ArticlePage(webapp2.RequestHandler):
  def get(self, **kwargs):
    bots = '|'.join([
        'Googlebot',
        'bingbot',
        'msnbot',
        'facebookexternalhit',
        'Facebot',
        'Twitterbot',
        'Google-Structured-Data-Testing-Tool'
      ])
    if re.search(bots, self.request.headers.get('User-Agent'), re.I):
      self.response.out.write(open('data/articles/' + kwargs['article_id'] + '.html').read())
    else:
      self.response.out.write(open('index.html').read())

app = webapp2.WSGIApplication([
    webapp2.Route('/', handler=MainPage),
    webapp2.Route('/index.html', handler=MainPage),
    webapp2.Route('/<page>/<category>', handler=MainPage),
    webapp2.Route('/<page>/<category>/', handler=MainPage),
    webapp2.Route('/<page>/<category>/<article_id>', handler=ArticlePage),
    webapp2.Route('/<page>/<category>/<article_id>/', handler=ArticlePage),
  ], debug=True)
