import React from "react";

export default function About() {
  return (
    <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-12">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">
        Centro Integrado de Formação Tecnológica - CINFOTEC
      </h1>

      <p className="mb-6 text-gray-700 leading-relaxed">
        O Centro Integrado de Formação Tecnológica - <strong>CINFOTEC</strong> -
        é uma instituição dedicada à excelência no ensino e capacitação
        profissional nas áreas de tecnologia e inovação. Nossa missão é preparar
        profissionais altamente qualificados para os desafios do mercado atual,
        promovendo o desenvolvimento sustentável e a inclusão tecnológica.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          Nossas Áreas de Formação
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <strong>Tecnologias de Informação:</strong> Formação completa em
            desenvolvimento de software, redes de computadores, segurança da
            informação e suporte técnico.
          </li>
          <li>
            <strong>Electricidade e Mecatrónica:</strong> Cursos práticos que
            abrangem instalação, manutenção e automação industrial com foco em
            inovação.
          </li>
          <li>
            <strong>Mecânica e Produção:</strong> Capacitação para atuar em
            processos produtivos, manutenção industrial e controle de qualidade.
          </li>
          <li>
            <strong>Metrologia:</strong> Ensino das técnicas de medição e
            controle dimensional essenciais para garantir a qualidade dos
            processos industriais.
          </li>
          <li>
            <strong>Empreendedorismo e Inovação:</strong> Incentivo ao
            desenvolvimento de ideias inovadoras e ao espírito empreendedor para
            transformar conhecimento em negócio.
          </li>
          <li>
            <strong>Energias Renováveis:</strong> Formação em tecnologias
            sustentáveis para geração e gestão de energias limpas, alinhada com
            as demandas ambientais globais.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          Nossa Visão
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Ser referência nacional em formação tecnológica, contribuindo para o
          crescimento econômico e social do país, promovendo inclusão e inovação
          tecnológica em todas as regiões atendidas.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          Nossa Missão
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Proporcionar educação profissional de qualidade, com foco no
          desenvolvimento de competências técnicas e humanas, preparando nossos
          alunos para os desafios do mundo moderno e as necessidades do mercado
          de trabalho.
        </p>
      </section>
    </main>
  );
}
