FROM ruby:3.3

RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  libssl-dev \
  libreadline-dev \
  zlib1g-dev \
  libyaml-dev \
  libxml2-dev \
  libxslt-dev \
  libffi-dev \
  nodejs \
  git \
  curl \
  && rm -rf /var/lib/apt/lists/*

RUN gem install bundler -v 4.0.8

WORKDIR /app

COPY Gemfile Gemfile.lock ./

ENV BUNDLE_PATH=/usr/local/bundle
ENV BUNDLER_VERSION=4.0.8
RUN bundle _4.0.8_ install --jobs 4 --retry 3

COPY . .

EXPOSE 3000
CMD ["sh", "-c", "rm -f tmp/pids/server.pid && bundle exec rails server -b 0.0.0.0"]