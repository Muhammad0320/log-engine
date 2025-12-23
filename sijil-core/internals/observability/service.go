package observability

import (
	"errors"
	"sijil-core/internals/ingest"
	"sijil-core/internals/projects"
)

var ErrForbidden = errors.New("access denied to project")

type Service struct {
	repo         Repository
	projectsRepo projects.Repository
	engine       *ingest.IngestionEngine
}

func NewService(repo Repository, projectRepo projects.Repository, engine *ingest.IngestionEngine) *Service {

	return &Service{
		repo:         repo,
		projectsRepo: projectRepo,
		engine:       engine,
	}

}
