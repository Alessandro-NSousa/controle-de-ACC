package br.com.acc.controle.repository;

import br.com.acc.controle.domain.Usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Usuario entity.
 */
@Repository
public interface UsuarioRepository extends UsuarioRepositoryWithBagRelationships, JpaRepository<Usuario, Long> {
    default Optional<Usuario> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Usuario> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Usuario> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select distinct usuario from Usuario usuario left join fetch usuario.certificado",
        countQuery = "select count(distinct usuario) from Usuario usuario"
    )
    Page<Usuario> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct usuario from Usuario usuario left join fetch usuario.certificado")
    List<Usuario> findAllWithToOneRelationships();

    @Query("select usuario from Usuario usuario left join fetch usuario.certificado where usuario.id =:id")
    Optional<Usuario> findOneWithToOneRelationships(@Param("id") Long id);
}
